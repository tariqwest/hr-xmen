var express = require('express');
var photoAI = require('./api/photoAI');

const app = express();

app.use(express.static('./'));
app.use(express.static('dist'));

photoAI.getFoodPrediction()

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
});