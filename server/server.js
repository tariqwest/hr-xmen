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