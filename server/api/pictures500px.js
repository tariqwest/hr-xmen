var API500px = require('500px'),
  api500px = new API500px('3rGIwTl7w9aP11gtVGHOS5nwm2P8jPrxpJXDbkgu');


module.exports = {
  searchPhotos: (food, res) => {
    api500px.photos.searchByTerm(food, { 'sort': '_score', 'rpp': '100', 'image_size': 440, 'only': 23 }, (error, results) => {
      if (error) {
        console.log(error);
      }
      var tilesData = results.photos.map((item) => {
        return {
          img: item.image_url,
          title: item.name,
          description: item.description
        }
      })
      res.json(tilesData)
    })
  }
}
