const Clarifai = require('clarifai');
const Promise = require('bluebird');


const app = new Clarifai.App(
  process.env.CLARIFAI_ID,
  process.env.CLARIFAI_KEY
);

module.exports = {
  // predict the contents of an image by passing in a url
  getFoodPrediction: (photoURL) => {
    return app.models.predict('bd367be194cf45149e75f01d59f77ba7', photoURL).then(
      (response) => {
        // console.log('*** Clarifai food predictions ***', response.outputs[0].data);
        const combinedPredictions = [];
        for (let i = 0; i < 5; i++) {
          combinedPredictions.push(response.outputs[0].data.concepts[i].name);
        }
        return Promise.resolve({ err: null, prediction: combinedPredictions });
      },
      (err) => {
        // console.error(err);
        // return Promise.resolve({err: err, prediction: null});
        throw `clarifai api:${err.statusText}`;
      }
    );
  },
};
