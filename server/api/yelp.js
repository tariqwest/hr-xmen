const Yelp = require('yelp-api-v3');

const yelp = new Yelp({
  app_id: process.env.YELP_ID,
  app_secret: process.env.YELP_KEY,
});

module.exports = {
  getRestaurant: (restaurantAddr, restaurantName) => {
    return yelp.search({ term: `${restaurantName}`, location: `${restaurantAddr}`, limit: 1 })
      .then(function(data) {
        data = JSON.parse(data);
        let restaurant = data.businesses[0];
        restaurant.categories = restaurant.categories.length > 1 ? restaurant.categories : ['no category'];
        let restaurantInfo = {
          id: restaurant.id,
          image_url: restaurant.image_url,
          review_count: restaurant.review_count,
          rating: restaurant.rating,
          url: restaurant.url,
          name: restaurant.name,
          location: restaurant.location.display_address.join(' '),
          categories: restaurant.categories,
        };
        return restaurantInfo;
      })
      .catch(err => {
        throw `yelp api: ${err}`;
      });
  },
};
