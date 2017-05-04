var request = require('request');
var querystring = require('querystring');

module.exports = {
  getMenuItems: (food, postal_code, country, callback) => {
    var options = {
      method: 'GET',
      url: 'https://openmenu.com/api/v2/search.php',
      qs: {
        key: process.env.OPENMENU_KEY || '5b17ec42-2f8c-11e7-a91a-00163eeae34c',
        s: food,
        postal_code: postal_code,
        country: country
      },
      useQuerystring: true
    };
    request(options, (err, res, body)=>{
      console.log('** Open menu result:', JSON.parse(body).response.result.items[0]);
    });
  },
}
