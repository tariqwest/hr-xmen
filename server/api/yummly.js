var yummly = require('yummly');

var credentials = {
    id: '',
    key: ''
};

var query = 'fried chicken';

// first API call to return a search result.. 2nd call to return details of search result
// query === search request
// returns first result from yummly

module.exports = {
    getRecipe: (query) => {
        yummly.search({
            credentials: credentials,
            query: {
                q: query
            }
        }, (err, res, body) => {
            if (err) {
                console.log(err)
            } else if (res === 200){
                 yummly.recipe({
                    credentials: credentials,
                    id: body.matches[0].id
                }, (err, res, body) => {
                    if (err) {
                        console.log(err)
                    } else {
                    console.log({
                            name: body.name,
                            description: body.attribution.text,
                            instructions: body.name,
                            prepTime: body.totalTime,
                            ingredients: body.ingredientLines,
                            rating: body.rating,
                            url: body.attribution.url
                        })
                    }
                })
            }
        })
    }
}
