var API500px = require('500px'),
    api500px = new API500px('3rGIwTl7w9aP11gtVGHOS5nwm2P8jPrxpJXDbkgu');


module.exports = {
    searchPhotos: (food) => {
        api500px.photos.searchByTerm( food , {'sort': '_score', 'rpp': '100', 'image_size': 440, 'only': 23}, (error, results) => {
        if (error) {
            console.log(error);
        }
        console.log(results.photos[0].image_url)
         })
    }
}
    

