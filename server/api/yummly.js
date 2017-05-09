var yummly = require('yummly');

var credentials = {
    id: '2e911d5a',
    key: '6d6f6d337087c3872e561bf6b171508f'
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
                        console.log(body)
                    }
                })
            }
        })
    }
}


