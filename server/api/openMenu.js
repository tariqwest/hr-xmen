const request = require('request-promise');
const _ = require('underscore');

module.exports = {
  getMenuItems: (food, postal_code, country) => {
    const options = {
      method: 'GET',
      url: 'https://openmenu.com/api/v2/search.php',
      qs: {
        key: process.env.OPENMENU_KEY,
        s: food,
        postal_code: postal_code,
        country: country,
        mi: 2,
      },
      useQuerystring: true,
    };
    return request(options)
      .then((result) => {
        if (JSON.parse(result).response.result.errors) {
          throw JSON.parse(result).response.result.errors[0];
        }
        result = JSON.parse(result).response.result.items;
        result = _.uniq(result, false, (item) => {
          return item.address_1;
        });
        return result;
      })
      .catch((err) => {
        throw `openmenu api: ${err}`;
      })
  },
}
