var Yelp = require('yelp-api-v3');

var yelp = new Yelp({
  app_id: process.env.YELP_ID,
  app_secret: process.env.YELP_KEY
});

// https://github.com/Yelp/yelp-api-v3/blob/master/docs/api-references/businesses-search.md

module.exports = {
	getRestaurant: (restaurantAddr, restaurantName) => {
	return yelp.search({term: `${restaurantName}`, location: `${restaurantAddr}`, limit: 1})
	.then(function (data) {
		data = JSON.parse(data);
		var restaurant = data.businesses[0];
		var restaurantInfo = {
			id: restaurant.id,
			image_url: restaurant.image_url,
			review_count: restaurant.review_count,
			rating: restaurant.rating,
			url: restaurant.url,
			name: restaurant.name,
			location : restaurant.location.display_address.join(' '),
			categories : restaurant.categories
		};
		//console.log('*** Result of yelp search', restYelpInfo);
		return restaurantInfo;
	})
	.catch(function (err) {
	    //console.error(err);
      throw 'yelp api: ' + err;
	});}
}