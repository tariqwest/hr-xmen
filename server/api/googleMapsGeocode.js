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
      console.log(result, '*** Google API response body')
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
      console.log({postalCode, countryCode}, '*** Parsed postal code and country')
      return Promise.resolve({postalCode, countryCode});
    });

    // return request(options, (err, res, body)=>{
    //   if(err){
    //     throw err;
    //   }
    //   var postalCode;
    //   var countryCode;
    //   for(var component of JSON.parse(body).results[0].address_components){
    //     if(component.types[0] === 'postal_code'){
    //       postalCode = component.short_name;
    //     }
    //     if(component.types[0] === 'country'){
    //       countryCode = component.short_name;
    //     }
    //   }
    //   console.log('** Google postal code lookup result:', postalCode, countryCode);
    //   return {postalCode, countryCode} ;
    // })
  },
}


