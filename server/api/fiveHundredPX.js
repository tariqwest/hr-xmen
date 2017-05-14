const FiveHundredPX = require('500px');
const api500px = new FiveHundredPX(process.env.FIVEHUNDREDPX_KEY);


module.exports = {
  searchPhotos: (food, res) => {
    api500px.photos.searchByTerm(food, { sort: '_score', rpp: '100', image_size: 440, only: 23 }, (error, results) => {
      if (error) {
        throw error;
      }
      const tilesData = results.photos.map((item) => {
        return {
          img: item.image_url,
          title: item.name,
          description: item.description,
        };
      });
      res.json(tilesData);
    });
  },
};
