var express = require('express');
var morgan = require('morgan');
var Promise = require('bluebird');
var _ = require('underscore');
var emoji = require('node-emoji');
var bodyParser = require('body-parser');
var photoAI = require('./api/photoAI');
var openMenu = require('./api/openMenu');
var yelp = require('./api/yelp');
var googleMapsGeocode = require('./api/googleMapsGeocode');
var pictures500px = require('./api/pictures500px');

// Replace with actual yummly API
var yummly = { getRecipes: (food)=>{
  var recipe = {
    name: food, 
    description: 'description blah blah blah', 
    instructions: 'instructions blah blah blah', 
    prepTime: '30mins', 
    ingredients: 'ingredients blah blah blah', 
    rating: '4.5', 
    url: 'http://yummly.com/recipes/123456'
  };
  return [{recipe}, {recipe}, {recipe}];
}}

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static('./'));
app.use(express.static('dist'));


// photoAI.getFoodPrediction()

// openMenu.getMenuItems('burger', '94102', 'US');


// var restaurantAddr = "10 Mason St, San Francisco, CA 94102";
// var restaurantName = "Taqueria Castillo";
// yelp.getRestaurant(restaurantAddr, restaurantName);

// googleMapsGeocode.getPostalCode('37.7836970', '-122.4089660');

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.get('/photos', (req, res)=>{

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
  
  /*

    process:
      submit userLocation coordinates to Google Maps
      receive user postal code from Google Maps
      submit photo url to photoAI
      receive ingredients from photoAI
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

  var foodPrediction;

  var recipeMenuItem;

  //var mockPhotoURL = 'http://www.burgergoesgreen.com/wp-content/uploads/2014/06/burgers.jpeg';
  //var mockUserLocation = {lat: '37.7836970', lng: '-122.4089660'};

  //photoAI.getFoodPrediction(req.body.photoURL)
  Promise.resolve('burger')
  .then((prediction)=>{
    console.log('*** Result of getFoodPrediction ***', prediction);
    foodPrediction = prediction;
    return googleMapsGeocode.getPostalCode(req.body.location.lat, req.body.location.lng);
  })
  .then(({postalCode, countryCode})=>{
    console.log('*** Result of getPostalCode ***', postalCode, countryCode);
    return openMenu.getMenuItems(foodPrediction, postalCode, countryCode);
  })
  .then((menuItems)=>{
    console.log('*** Result of getMenuItems ***', JSON.parse(menuItems).response.result.items);
    var menuItems = JSON.parse(menuItems).response.result.items;
    recipeMenuItem = menuItems[0].menu_item_name; 
    menuItems = _.uniq(menuItems, false, (item)=>{
      return item.address_1;
    });
    return Promise.resolve(menuItems);
  }).mapSeries((menuItem)=>{
    return yelp.getRestaurant(`${menuItem.address_1}, ${menuItem.city_town}, ${menuItem.state_province}`, menuItem.restaurant_name);
  }).then((yelpRestaurants)=>{
    clientResponse.restaurants = yelpRestaurants.sort((a, b)=>{
      if(b.rating - a.rating === 0){
        return b.review_count - a.review_count;
      }
      return b.rating - a.rating;
    }).slice(0,3);
    console.log('*** Result of openMenu + yelp restaurants ***', clientResponse.restaurants);
  }).then(()=>{
    clientResponse.recipes = yummly.getRecipes(recipeMenuItem);
    console.log('*** Result of openMenu + yummly recipes ***', clientResponse.recipes);
    res.json(clientResponse);
  });

});

app.post('/photos/photo-save', (req, res)=>{
  
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
  console.log(emoji.emojify(':rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket:'));
});