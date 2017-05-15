const Promise = require('bluebird');
const request = require('request-promise');

module.exports = {
  getPostalCode: (lat, lng) => {
    const options = {
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: {
        key: process.env.GOOGLEMAPS_KEY,
        latlng: `${lat},${lng}`,
        result_type: 'postal_code',
      },
      useQuerystring: true,
    };
    return request(options)
      .then((result) => {
        let postalCode;
        let countryCode;
        for (let component of JSON.parse(result).results[0].address_components) {
          if (component.types[0] === 'postal_code') {
            postalCode = component.short_name;
          }
          if (component.types[0] === 'country') {
            countryCode = component.short_name;
          }
        }
        return Promise.resolve({ postalCode, countryCode });
      })
      .catch((err) => {
        throw `google maps geocode api: ${err}`;
      });
  },
};
