var Promise = require('bluebird');
var request = require('request-promise');
var querystring = require('querystring');
var _ = require('underscore');

module.exports = {
  getMenuItems: (food, postal_code, country) => {
    var options = {
      method: 'GET',
      url: 'https://openmenu.com/api/v2/search.php',
      qs: {
        key: process.env.OPENMENU_KEY,
        s: food,
        postal_code: postal_code,
        country: country,
        mi: 1,
      },
      useQuerystring: true
    };
    return request(options)
    .then((result)=>{
      if(JSON.parse(result).response.result.errors){
        console.log('*** Open menu error ***', result);
        throw JSON.parse(result).response.result.errors[0];
      }
      result = JSON.parse(result).response.result.items;
      result = _.uniq(result, false, (item)=>{
        return item.address_1;
      });
      console.log('*** Open menu result ***', result);
      return result;
    })
    .catch((err)=>{
      throw 'openmenu api: ' + err;
    })
  },
}