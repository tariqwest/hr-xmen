// Core & utilities
require('dotenv').config(); // import environmental variables from .env file
const express = require('express');
const Promise = require('bluebird');
const _ = require('underscore');
const emoji = require('node-emoji');
const dummyData = require('./dummyData');
const database = require('../db-models/photoHungryDB.js');
const User = database.dbuser;

// Middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const fbStrategy = require('passport-facebook').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// APIs
const clarifai = require('./api/clarifai');
const openMenu = require('./api/openMenu');
const yelp = require('./api/yelp');
const googleMapsGeocode = require('./api/googleMapsGeocode');
const fiveHundredPX = require('./api/fiveHundredPX');
const yummly = require('./api/yummly');

// Initialize app
const app = express();

// Setup middleware
app.use(morgan('tiny'));
// app.use(express.static('./'));
// app.use(express.static('dist'));
app.use(bodyParser.json())
  .use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Set response headers for all requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Facebook login using passport + fb-passport + express-sessions modules
const callbackURL = process.env.NODE_ENV === 'production' ? `${process.env.ENV_URL}/login/facebook/callback` : `${process.env.ENV_URL || 'http://localhost'}:${process.env.PORT || 8080}/login/facebook/callback`;

passport.use(new fbStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_KEY,
  callbackURL,
  profileFields: ['id', 'email', 'first_name', 'last_name'],
},
  (token, refreshToken, profile, done) => {
    console.log('*** Facebook auth success ***', token, profile);
    process.nextTick(() => {
      // Search for existing user
      User.findOne({ 'fbID': profile.id })
        .then((user, err) => {
          if (err) {
            return done(err);
          }
          if (user) {
            console.log('** Existing user found **', user);
            return done(null, user);
          } else {
            const newUser = new User();
            newUser.fbID = profile.id;
            newUser.fbToken = token;
            newUser.fbFirstName = profile.name.givenName;
            newUser.fbLastName = profile.name.familyName;
            // newUser.fbEmail = (profile.emails[0].value || '').toLowerCase();

            newUser.save(function (err) {
              if (err) {
                return done(err);
              }
              console.log('** New user created **', newUser);
              return done(null, newUser);
            });
          }
        });
    });
  }));

// configure passport authenticated session persistence.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

// Routes setup
app.use('/app', ensureLoggedIn('/login'));

app.use('/app', express.static(__dirname + '/../dist'));

app.get('/', ensureLoggedIn('/login'), function (req, res) {
  res.redirect('/app');
});

app.use('/login', express.static(__dirname + '/../static/login'));

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

app.get('/api/photos', (req, res) => {
  fiveHundredPX.searchPhotos('food', res);
});

app.post('/api/photos/photo-process-test', (req, res) => {
  console.log(req.body);
  res.json(dummyData);
});

app.post('/api/photos/photo-process', (req, res) => {
  const clientResponse = {};
  let menuItemSearchArray;
  let recipeSearchString;
  clientResponse.photoURL = req.body.photoURL;
  clientResponse.status = 'success';
  clientResponse.statusCode = 200;
console.log(req.body.locatoin)
  Promise.resolve(clarifai.getFoodPrediction(req.body.photoURL))
    .then(({ prediction }) => {
      console.log('*** Result of getFoodPrediction ***', prediction);
      menuItemSearchArray = prediction;
      console.log(req.body.location);
      return googleMapsGeocode.getPostalCode(req.body.location.lat || 37.773972, req.body.location.lng || -122.431297);
    })
    .then(({ postalCode, countryCode }) => {
      console.log('*** Result of getPostalCode ***', postalCode, countryCode);
      return openMenu.getMenuItems(menuItemSearchArray[0], postalCode, countryCode);
    })
    .then((menuItems) => {
      console.log('*** Result of getMenuItems ***', menuItems.length);
      recipeSearchString = menuItems[0].menu_item_name;
      return Promise.resolve(menuItems);
    })
    .mapSeries((menuItem) => {
      return yelp.getRestaurant(`${menuItem.address_1}, ${menuItem.city_town}, ${menuItem.state_province}`, menuItem.restaurant_name);
    })
    .then((restaurants) => {
      clientResponse.restaurants = restaurants.sort((a, b) => {
        if (b.rating === a.rating) {
          return b.review_count - a.review_count;
        }
        return b.rating - a.rating;
      }).slice(0, 3);
      console.log('*** Result of openMenu + yelp restaurants lookup ***', clientResponse.restaurants.length);
    })
    .then(() => {
      return yummly.getRecipes(recipeSearchString);
    })
    .then((recipes) => {
      clientResponse.recipes = recipes;
      console.log('*** Result of openMenu + yummly recipes ***', clientResponse.recipes.length);
      res.json(clientResponse);
    })
    .catch((err) => {
      console.log('*** Error while processing photo ***', err);
      res.status(404).send({ statusCode: 404, status: err });
    });
});

app.post('/api/photos/photo-save', (req, res) => {
  console.log('received POST request on /photos/photo-save');
  console.log('** Photo save request body **', req.body);
  console.log('** Photo save request session **', req.session);

  Promise.resolve(database.dbuser.find({ _id: req.session.passport.user._id }))
    .then((result) => {
      console.log('find user operation returns : ', result[0]);
      const photoHungry4DB = new database.saveditem({
        photoURL: req.body.imgURL,
        savedItem: req.body.recipeORRestaurant, // restaurant or recipe
        userID: result[0]._id,
      });
      console.log('photoHungry4DB created');
      return (photoHungry4DB);
    }).catch((err) => {
      console.log('find user failed');
    })
    .then((photoHungry4DB) => {
      photoHungry4DB.save();
    })
    .then(() => {
      console.log('"saveditem" saved to database');
      res.end('success');
    });
});

app.get('/api/photos/profile', (req, res) => {
  console.log('received GET request on /photos/profile');
  Promise.resolve(database.dbuser.find({ _id: req.session.passport.user._id }))
    .then((result) => {
      console.log('find user operation returns : ', result[0]);
      return (result[0]._id);
    }).catch((err) => {
      console.log('find user failed');
    })
    .then((userID4Profile) => {
      console.log('userID4Profile = ', userID4Profile);
      return (database.saveditem.find({ userID: userID4Profile }));
    })
    .then((userProfile) => {
      console.log('returned user profile: ', userProfile);
      res.json(userProfile);
      res.end('success');
    })
    .catch((err) => {
      console.log('failed to retrieve profile');
      res.end('failure');
    });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('app listening on', port);
  console.log(emoji.emojify(':rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket: :rocket:'));
});
