var FiveHundredPX = require('500px');
var api500px = new FiveHundredPX(process.env.FIVEHUNDREDPX_KEY);


module.exports = {
    searchPhotos: (food) => {
        api500px.photos.searchByTerm( food , {'sort': '_score', 'rpp': '100', 'image_size': 440, 'only': 23}, (error, results) => {
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
        console.log(tilesData);
        // 100 entries
         })
    }
}
    

