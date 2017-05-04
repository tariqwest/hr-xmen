var express = require('express');
var photoAI = require('./api/photoAI');
var openMenu = require('./api/openMenu');

const app = express();

app.use(express.static('./'));
app.use(express.static('dist'));

photoAI.getFoodPrediction();

openMenu.getMenuItems('burger', 'san francisco', 'ca', (result)=>{ console.log('** OpenMenu result: ', JSON.stringify(result)) });

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
});