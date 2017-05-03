var Clarifai = require('clarifai');

var app = new Clarifai.App(
  '3CoDBiOYJ2Ym9bzNfqnnKm4E1P_f1FcCGG4xOnAh',
  'DP336zGTsE23rwS3t-0JRo1-kw7-jnwC2JOv4gOK'
);

module.exports.helpers = {
  // predict the contents of an image by passing in a url
  getFoodPrediction: (imageURL) => {
    app.models.predict('bd367be194cf45149e75f01d59f77ba7', 'https://samples.clarifai.com/food.jpg').then(
      function(response) {
        console.log(response);
      },
      function(err) {
        console.error(err);
      }
    )
  }
}
