// Core & utilities
require('dotenv').config(); // import environmental variables from .env file
const express = require('express');
const Promise = require('bluebird');
const _ = require('underscore');
const emoji = require('node-emoji');
const database = require('../db-models/photoHungryDB.js')
const dummyData = require('./dummyData');

// Middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
//const cookieParser = require('cookie-parser');
const passport = require('passport');
const fbStrategy = require('passport-facebook').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// APIs
var clarifai = require('./api/clarifai');
var openMenu = require('./api/openMenu');
var yelp = require('./api/yelp');
var googleMapsGeocode = require('./api/googleMapsGeocode');
var fiveHundredPX = require('./api/fiveHundredPX');
var yummly = require('./api/yummly');

// Initialize app
const app = express();

// Setup middleware
app.use(morgan('tiny'));
// app.use(express.static('./'));
// app.use(express.static('dist'));
app.use(bodyParser.json())
  .use(bodyParser.urlencoded());
//app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Set response headers for all requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Facebook login using passport + fb-passport + express-sessions modules
var callbackURL = process.env.NODE_ENV === 'production' ? `${process.env.ENV_URL}/login/facebook/callback` : `${process.env.ENV_URL || 'http://localhost'}:${process.env.PORT || 8080}/login/facebook/callback`;

passport.use(new fbStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_KEY,
    callbackURL: callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  },
  (token, refreshToken, profile, done) => {
    console.log('*** Facebook auth success ***', token, profile);
    // process.nextTick(() => {
    //   // Search for existing user
    //   User.findOne({ 'fbID': profile.id })
    //     .then(function(user, err) {
    //       if (err) {
    //         return done(err);
    //       }
    //       if (user) {
    //         return done(null, user._id);
    //       } else {
    //         var newUser = new User();
    //         newUser.fbID = profile.id;
    //         newUser.fbToken = token;
    //         newUser.fbFirstName = profile.name.givenName
    //         newUser.fbLastName = profile.name.familyName;
    //         //newUser.fbEmail = (profile.emails[0].value || '').toLowerCase();

    //         newUser.save(function(err) {
    //           if (err) {
    //             //throw err;
    //           }
    //           console.log('** New user created **', newUser);
    //           return done(null, newUser._id);
    //         });
    //       }
    //     });
    // });
    done(null, profile.id);
  }));

// configure passport authenticated session persistence.
passport.serializeUser(function(userID, cb) {
  cb(null, userID);
});

passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

// Routes setup
app.use('/app', ensureLoggedIn('/login'));

app.use('/app', express.static(__dirname + '/../dist'));

app.get('/', ensureLoggedIn('/login'), function(req, res) {
  res.redirect('/app');
});

app.use('/login', express.static(__dirname + '/../static/login'));

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/api/photos', (req, res) => {
  fiveHundredPX.searchPhotos('food', res)
});

app.post('/api/photos/photo-process-test', (req, res) => {
  console.log(req.body)
  res.json(dummyData)
});

// openMenu.getMenuItems('milk', 94117, 'US');

// clarifai.getFoodPrediction('https://drscdn.500px.org/photo/121835289/w%3D440_h%3D440/3cc831ecc8cc6cfcfb15f0a7876acbae?v=5')

app.post('/api/photos/photo-process', (req, res)=>{

  var clientResponse = {};
  var menuItemSearchArray;
  var recipeSearchString;
  clientResponse.photoURL = req.body.photoURL;
  clientResponse.status = 'success';
  clientResponse.statusCode = 200;

  Promise.resolve(clarifai.getFoodPrediction(req.body.photoURL))
  .then(({prediction})=>{
    console.log('*** Result of getFoodPrediction ***', prediction);
    menuItemSearchArray = prediction;
    return googleMapsGeocode.getPostalCode(req.body.location.lat, req.body.location.lng);
  })
  .then(({postalCode, countryCode})=>{
    console.log('*** Result of getPostalCode ***', postalCode, countryCode);
    return openMenu.getMenuItems(menuItemSearchArray[0], postalCode, countryCode);
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

app.post('/api/photos/photo-save', (req, res)=>{
  /*
    Here's an example of how to send the data from the request to the database.
    it still needs to 'get user for this request'.
  */
  console.log("received POST request on /photos/photo-save");

  var testfbID = "ColonelSanders";
  Promise.resolve(database.dbuser.find({ fbID: testfbID }))
    .then((result) => {
      console.log('find fbID operation returns : ', result[0]._id);
      var photoHungry4DB = new database.saveditem({ 
        photoURL: "http://leitesculinaria.com/89229/recipes-batter-fried-chicken.html", 
        savedItem: { "restaurant" : "KFC", "address" : "691 Eddy St Ste 249, San Francisco, CA 94109", "phone": "1-800-EAT-CHKN" }, // restaurant or recipe
        userID: result[0]._id
      });
      console.log('photoHungry4DB created');
      return (photoHungry4DB);
    }).catch((err) => { 
      console.log("find fbID failed");
    })
    .then((photoHungry4DB) => {
      photoHungry4DB.save()
    })
    .then(() => {
      console.log("\"saveditem\" saved to database")
      res.end("success");
    });
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

app.get('/api/photos/profile', (req, res)=>{

  console.log("received GET request on /photos/profile");
  Promise.resolve(database.dbuser.find({ fbID: "BugsBunny" }))
    .then((result) => {
      console.log('find fbID operation returns : ', result[0]._id);
      return (result[0]._id);
    }).catch((err) => { 
      console.log("find fbID failed");
    })
    .then((userID4Profile) => {
      console.log ("userID4Profile = ", userID4Profile);
      return (database.saveditem.find({ userID: userID4Profile}));
    })
    .then((userProfile) => {
      console.log("returned user profile: ", userProfile);
      res.json(userProfile);
      res.end("success");
    })
    .catch((err) => { 
      console.log("failed to retrieve profile");
      res.end("failure");
    });

  //res.json(dummyData.tilesData)
  /*
  Get user's profile info
  - Saved photos, restaurants, recipes
  */

});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('app listening on', port);
  console.log(emoji.emojify(':rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket:'));
});
