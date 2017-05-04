var Yelp = require('yelp-api-v3');

var yelp = new Yelp({
  app_id: '9LE31kYOAIuy86mbA9kTng',
  app_secret: 'd3RpK8hhVmu2ttplqnkfwnUtn8AihSv6jpnHKw07zsWrBzFKPto6rWtjO9MLpIN5'
});

// https://github.com/Yelp/yelp-api-v3/blob/master/docs/api-references/businesses-search.md

module.exports = {
	yelpAPI: (location) => {yelp.search({term: 'food', location: `${location}`, price: '1,2,3', limit: 1})
	.then(function (data) {
		var properData = (JSON.parse(data));
		var restaurant = properData.businesses[0];
		var restYelpInfo = {
			id: restaurant.id,
			image_url: restaurant.image_url,
			review_count: restaurant.review_count,
			rating: restaurant.rating,
			url: restaurant.url,
			name: restaurant.name,
			location : restaurant.location.display_address.join(' '),
			categories : restaurant.categories
		};
		console.log(restYelpInfo);

	})
	.catch(function (err) {
	    console.error(err);
	});}
}