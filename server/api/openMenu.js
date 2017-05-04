var request = require('request');



module.exports = {
  getMenuItems: (foodString, city, state, callback) => {
    var options = {
      method: 'GET',
      url: 'http://openmenu.com/api/v1/menu',
      qs: {
        key: '5b17ec42-2f8c-11e7-a91a-00163eeae34c',
        output: 'json',
        item: foodString,
        city: city,
        state: state
      }
    };
    request(options, (result)=>{
      callback(result);
    });
  },
}
