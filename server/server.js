const express = require('express');
var morgan = require('morgan');
var Promise = require('bluebird');
var _ = require('underscore');
var emoji = require('node-emoji');
var bodyParser = require('body-parser');
var clarifai = require('./api/clarifai');
var openMenu = require('./api/openMenu');
var yelp = require('./api/yelp');
var webpackHotMiddleware = require('webpack-hot-middleware');
var googleMapsGeocode = require('./api/googleMapsGeocode');
var pictures500px = require('./api/pictures500px');
var database = require('../db-models/photoHungryDB.js')

// Replace with actual yummly API
var yummly = {
  getRecipes: (food) => {
    var recipe = {
      name: food,
      description: 'description blah blah blah',
      instructions: 'instructions blah blah blah',
      prepTime: '30mins',
      ingredients: 'ingredients blah blah blah',
      rating: '4.5',
      url: 'http://yummly.com/recipes/123456'
    };
    return [{ recipe }, { recipe }, { recipe }];
  }
}

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static('./'));
app.use(express.static('dist'));


// clarifai.getFoodPrediction()

// openMenu.getMenuItems('burger', '94102', 'US');


// var restaurantAddr = "10 Mason St, San Francisco, CA 94102";
// var restaurantName = "Taqueria Castillo";
// yelp.getRestaurant(restaurantAddr, restaurantName);

// googleMapsGeocode.getPostalCode('37.7836970', '-122.4089660');

/* Following middleware, because had issues with no 'Access-Control-Allow-Origin'
Thanks to:
http://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue */
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

const tilesData = [{
  img: 'http://cdn-image.foodandwine.com/sites/default/files/201111-xl-liege-waffles.jpg',
  title: 'Liege Waffles',
  description: 'description',
}, {
  img: 'https://static1.squarespace.com/static/50a43af2e4b013b04b877d4e/50a48341e4b06eecde88101c/50c183d0e4b08bba8489d091/1434199989721/_MG_9865.jpg',
  title: 'Liege Waffles',
  description: 'description',
}, {
  img: 'https://www.sweetashoney.co/wp-content/uploads/DSC_0081.jpg',
  title: 'Liege Waffles',
  description: 'description',
}, {
  img: 'http://1.bp.blogspot.com/-Zg0XbmBG-NI/VCnq3KYS5RI/AAAAAAAAG1s/ri7467hdlKA/s1600/waffle%2Bcover%2BREVISED.jpg',
  title: 'Liege Waffles',
  description: 'description',
}, {
  img: 'http://www.europeancuisines.com/sites/default/files/Liege_Waffles_Plated_Up.jpg',
  title: 'Liege Waffles',
  description: 'description',
}, {
  img: 'https://2.bp.blogspot.com/-gvWAv7FO6wI/Vthl0_-QzUI/AAAAAAAAQ8U/CT20sQq_zJc/s1600/DSC_5768.JPG',
  title: 'Liege Waffles',
  description: 'description',
}, {
  img: 'https://foodydoody.files.wordpress.com/2015/09/dsc_5130.jpg',
  title: 'Liege Waffles',
  description: 'description',
}, {
  img: 'http://4.bp.blogspot.com/-Yz0eHsyFtLI/VP5dcZrAMyI/AAAAAAAAPLk/-s2uDvuVlEo/s1600/Caramelized%2BWaffles%2B(Liege%2BWaffles)%2B2.jpg',
  title: 'Liege Waffles',
  description: 'description',
}, ];

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});



app.get('/photos', (req, res) => {
  pictures500px.searchPhotos('food', res)
});

app.post('/photos/photo-process', (req, res) => {

  /*

    process:
      submit userLocation coordinates to Google Maps
      receive user postal code from Google Maps
      submit photo url to clarifai
      receive ingredients from clarifai
      submit top ingredient to openMenu

      process restaurants:
        receive menu item + restaurant (address) from openMenu
        submit restuarant to yelp
        receive retsaurant details from yelp

      process recipes:
        receive menu item from openMenu
        submit menu item to yummly
        receive recipe details from yummly

    request:
      format: JSON
      contents:
        photoURL ''
        userLocation {lat,lng}

    response:
      format: JSON
      contents:
        status (success or fail)
        photoURL ''
        recipes [{name, description, instructions, prepTime, ingredients, rating, url}, {...}]
        restaurants [{name, address, rating}, {...}]

  */

  var clientResponse = {};

  clientResponse.photoURL = req.body.photoURL;

  clientResponse.status = 'success';

  clientResponse.statusCode = 200;

  var menuItemSearchString;

  var recipeSearchString;

  Promise.resolve(clarifai.getFoodPrediction(req.body.photoURL))
    .then(({ prediction }) => {
      console.log('*** Result of getFoodPrediction ***', prediction);
      menuItemSearchString = prediction;
      return googleMapsGeocode.getPostalCode(req.body.location.lat, req.body.location.lng);
    })
    .then(({ postalCode, countryCode }) => {
      console.log('*** Result of getPostalCode ***', postalCode, countryCode);
      return openMenu.getMenuItems(menuItemSearchString, postalCode, countryCode);
    })
    .then((menuItems) => {
      console.log('*** Result of getMenuItems ***', menuItems);
      recipeSearchString = menuItems[0].menu_item_name;
      return Promise.resolve(menuItems);
    })
    .mapSeries((menuItem) => {
      return yelp.getRestaurant(`${menuItem.address_1}, ${menuItem.city_town}, ${menuItem.state_province}`, menuItem.restaurant_name);
    })
    .then((restaurants) => {
      clientResponse.restaurants = yelpRestaurants.sort((a, b) => {
        if (b.rating - a.rating === 0) {
          return b.review_count - a.review_count;
        }
        return b.rating - a.rating;
      }).slice(0, 3);
      console.log('*** Result of openMenu + yelp restaurants lookup ***', clientResponse.restaurants);
    })
    .then(() => {
      clientResponse.recipes = yummly.getRecipes(recipeMenuItem);
      console.log('*** Result of openMenu + yummly recipes ***', clientResponse.recipes);
      res.json(clientResponse);
    })
    .catch((err) => {
      console.log('*** Error while processing photo ***', err);
      res.status(404).send({ statusCode: 404, status: err });
    });
});

app.post('/photos/photo-save', (req, res) => {
  /*
    Here's an example of how to send the data from the request to the database.
    it still needs to 'get user for this request'.
  */
  console.log("received POST request on /photos/photo-save");

  // var photoHungry4DB = new database.foodinfo({
  //   picture_url: req.body.picture_url,
  //   recipe_url: req.body.recipe_url,
  //   restaurant: {
  //     name: req.body.restaurant.name,
  //     address: req.body.restaurant.address,
  //     phone: req.body.restaurant.phone,
  //     menuItemName: req.body.restaurant.menuItemName,
  //     },
  //   user_record: req.body.user_record
  // });

  // The following is just a hardcoded example to test write to the database.
  var photoHungry4DB = new database.fsresult({
    picture_url: 'http://leitesculinaria.com/89229/recipes-batter-fried-chicken.html',
    recipe_url: 'http://leitesculinaria.com/89229/recipes-batter-fried-chicken.html',
    restaurant: {
      name: 'KFC',
      address: '691 Eddy St Ste 249, San Francisco, CA 94109',
      phone: '1-800-EAT-CHKN',
      menuItemName: 'fried chicken: 8 piece bucket, original recipe',
    },
    user_record: 'A Very Hungry Person!'
  });

  console.log('photoHungry4DB created');
  photoHungry4DB.save(function(error) {
    if (error) {
      console.log('error: photoHungry4DB *DID NOT* save to database');
    } else {
      console.log('success: photoHungry4DB saved to database');
    }
  });
  res.end();
  /*
    process:
      receive post request from client
      get user for this request
      add request photo to DB with owner set to request user

    request:
      format: JSON
      contents:
        photoURL ''
        restaurants [{ / see above / }, {...}]
        recipes [{ / see above / }, {...}]

    response:
      format: JSON
      contents:
        status (success or fail)

  */
});

app.get('/photos/profile', (req, res) => {
  res.json(tilesData)
    /*
    Get user's profile info
    - Saved photos, restaurants, recipes
    */

});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
  console.log(emoji.emojify(':rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket:'));
});
