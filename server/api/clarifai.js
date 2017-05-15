const Clarifai = require('clarifai');
const Promise = require('bluebird');

const clarifai = new Clarifai.App(
  process.env.CLARIFAI_ID,
  process.env.CLARIFAI_KEY
);

module.exports = {
  getFoodPrediction: (photoURL) => {
    return clarifai.models.predict('bd367be194cf45149e75f01d59f77ba7', photoURL)
      .then(
        (response) => {
          const combinedPredictions = [];
          for (let i = 0; i < 5; i++) {
            combinedPredictions.push(response.outputs[0].data.concepts[i].name);
          }
          return Promise.resolve({ err: null, prediction: combinedPredictions });
        },
        (err) => {
          throw `clarifai api: ${err.statusText}`;
        }
      );
  },
};
