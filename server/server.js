// Core & utilities
require('dotenv').config();
const express = require('express');
var Promise = require('bluebird');
var _ = require('underscore');
var emoji = require('node-emoji');
var database = require('../db-models/photoHungryDB.js')
var dummyData = require('./dummyData');

// Middleware
var morgan = require('morgan');
var bodyParser = require('body-parser');
var webpackHotMiddleware = require('webpack-hot-middleware');

// APIs
var clarifai = require('./api/clarifai');
var openMenu = require('./api/openMenu');
var yelp = require('./api/yelp');
var googleMapsGeocode = require('./api/googleMapsGeocode');
var fineHundredPX = require('./api/fiveHundredPX');
var yummly = require('./api/yummly');


// Initialize app
const app = express();

// Setup middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static('./'));
app.use(express.static('dist'));


// Set response headers for all requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}); 

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.get('/photos', (req, res)=>{
  console.log('GOT')
  res.json(dummyData.tilesData)
  /*

  request:
    N/A - get with no params

  response:
    format: JSON
    contents:
      status (success or fail)
      photos: [ 'url', '...']

  */

});

app.post('/photos/photo-process', (req, res)=>{

  var clientResponse = {};

  clientResponse.photoURL = req.body.photoURL;

  clientResponse.status = 'success';

  clientResponse.statusCode = 200;

  var menuItemSearchString;

  var recipeSearchString;

  Promise.resolve(clarifai.getFoodPrediction(req.body.photoURL))
  .then(({prediction})=>{
    console.log('*** Result of getFoodPrediction ***', prediction);
    menuItemSearchString = prediction;
    return googleMapsGeocode.getPostalCode(req.body.location.lat, req.body.location.lng);
  })
  .then(({postalCode, countryCode})=>{
    console.log('*** Result of getPostalCode ***', postalCode, countryCode);
    return openMenu.getMenuItems(menuItemSearchString, postalCode, countryCode);
  })
  .then((menuItems)=>{
    console.log('*** Result of getMenuItems ***', menuItems.length);
    recipeSearchString = menuItems[0].menu_item_name;
    return Promise.resolve(menuItems);
  })
  .mapSeries((menuItem)=>{
    return yelp.getRestaurant(`${menuItem.address_1}, ${menuItem.city_town}, ${menuItem.state_province}`, menuItem.restaurant_name);
  })
  .then((restaurants)=>{
    clientResponse.restaurants = restaurants.sort((a, b)=>{
      if(b.rating === a.rating){
        return b.review_count - a.review_count;
      }
      return b.rating - a.rating;
    }).slice(0,3);
    console.log('*** Result of openMenu + yelp restaurants lookup ***', clientResponse.restaurants.length);
  })
  .then(()=>{
    return yummly.getRecipes(recipeSearchString);
  })
  .then((recipes)=>{
    clientResponse.recipes = recipes;
    console.log('*** Result of openMenu + yummly recipes ***', clientResponse.recipes.length);
    res.json(clientResponse);
  })
  .catch((err)=>{
    console.log('*** Error while processing photo ***', err);
    res.status(404).send({statusCode: 404, status: err});
  });
});

app.post('/photos/photo-save', (req, res)=>{
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
  photoHungry4DB.save(function(error){
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

app.get('/photos/profile', (req, res)=>{
  res.json(dummyData.tilesData)
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