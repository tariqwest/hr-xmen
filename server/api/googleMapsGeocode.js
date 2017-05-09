var Promise = require('bluebird');
var request = require('request-promise');
var querystring = require('querystring');

module.exports = {
  getPostalCode: (lat, lng, callback) => {
    var options = {
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: {
        key: process.env.GOOGLEMAPS_KEY || 'AIzaSyAcEoPnIMOVBKVvD00uKpt8yJ7Spur0pUQ',
        latlng: `${lat},${lng}`,
        result_type: 'postal_code'
      },
      useQuerystring: true
    };
    return request(options)
    .then((result)=>{
      // console.log('*** Google API response body ***', result)
      var postalCode;
      var countryCode;
      for(var component of JSON.parse(result).results[0].address_components){
        if(component.types[0] === 'postal_code'){
          postalCode = component.short_name;
        }
        if(component.types[0] === 'country'){
          countryCode = component.short_name;
        }
      }
      // console.log('*** Parsed postal code and country ***', {postalCode, countryCode}, )
      return Promise.resolve({postalCode, countryCode});
    });
  },
}


