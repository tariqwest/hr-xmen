var express = require('express');
var emoji = require('node-emoji');
var photoAI = require('./api/photoAI');
var openMenu = require('./api/openMenu');
var yelp = require('./api/yelpAPI');

const app = express();

app.use(express.static('./'));
app.use(express.static('dist'));

// photoAI.getFoodPrediction()
// openMenu.getMenuItems('burger', '94103', 'US');

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

// some sample code to use the yelp api
// var restaurantAddr = "809 Bush St San Francisco, CA 94108";
// yelp.yelpAPI(restaurantAddr);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
  console.log(emoji.emojify(':rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket:'));
});

app.get('/photos', ()=>{
  /*

  request:
    N/A - get with no params

  response:
    format: JSON
    contents:
      status (success or fail)
      photos: [{ url }, { ... }]
  
  */
});

app.post('/process_photo', ()=>{
  
  /*

    process:
      submit userLocation coordinates to Google Maps
      receive user postal code from Google Maps
      submit photo url to photoAI
      receive ingredients from photoAI
      submit top ingredient to openMenu

      process restaurants:
        receive menu item + restaurant (address) from openMenu 
        submit restuarnt to yelp
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

});

app.post('/save_photo', ()=>{
  
  /*

    process:
      receive post request from client
      get user for this request
      add request photo to DB with owner set to request user

    request:
      format: JSON
      contents:
        photoURL ''
        restaurants [{name, address, rating, url}, {...}]
        recipes [{}, {...}]

    response:
      format: JSON
      contents:
        status (success or fail)
      
  */

});