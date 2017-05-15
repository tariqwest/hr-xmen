const FiveHundredPX = require('500px');
const Promise = require('bluebird');
const fiveHundredPX = new FiveHundredPX(process.env.FIVEHUNDREDPX_KEY);
fiveHundredPX.photos.searchByTermAsync = Promise.promisify(fiveHundredPX.photos.searchByTerm);

module.exports = {
  searchPhotos: (food) => {
    return fiveHundredPX.photos.searchByTermAsync(food, { sort: '_score', rpp: '100', image_size: 440, only: 23 })
      .then((result) => {
        const photos = result.photos.map((item) => {
          return {
            img: item.image_url,
            title: item.name,
            description: item.description,
          };
        });
        return photos;
      })
      .catch((err) => {
        throw `500px api: ${err}`;
      });
  },
};
