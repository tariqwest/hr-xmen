var Promise = require('bluebird');
var request = require('request-promise');
var querystring = require('querystring');

module.exports = {
  getMenuItems: (food, postal_code, country) => {
    var options = {
      method: 'GET',
      url: 'https://openmenu.com/api/v2/search.php',
      qs: {
        key: process.env.OPENMENU_KEY || '5b17ec42-2f8c-11e7-a91a-00163eeae34c',
        s: food,
        postal_code: postal_code,
        country: country,
        mi: 1,
      },
      useQuerystring: true
    };
    return request(options)
    .then((result)=>{
      //console.log('** Open menu result:', result);//JSON.parse(result).response.result.items[0]);
      return Promise.resolve(result); 
    });
  },
}
