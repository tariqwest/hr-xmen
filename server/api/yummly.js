const Promise = require('bluebird');
const yummlySearchAsync = Promise.promisify(require('yummly').search, { multiArgs: true });
// var yummly = require('yummly');

const credentials = {
  id: process.env.YUMMLY_ID,
  key: process.env.YUMMLY_KEY,
};

// first API call to return a search result.. 2nd call to return details of search result
// query === search request
// returns first result from yummly

module.exports = {
  getRecipes: query => {
    return yummlySearchAsync({
      credentials,
      query: {
        q: query,
      },
    })
      .then(([status, body]) => {
        const recipes = [];
        const recipeResults = body.matches.sort((a, b) => {
          if (a.rating === b.rating) {
            return b.id > a.id;
          }
          return b.rating - a.rating;
        }).slice(0, 3);
        // console.log('*** Recipes from yummly ***', recipes.length);

        for (const recipeResult of recipeResults) {
          const recipe = {
            name: recipeResult.recipeName,
            prepTime: `${Math.floor(recipeResult.totalTimeInSeconds / 60)} mins`,
            ingredients: recipeResult.ingredients,
            rating: recipeResult.rating,
            source: recipeResult.sourceDisplayName,
            url: `http://www.yummly.co/#recipe/${recipeResult.id}`,
          };
          recipes.push(recipe);
        }
        return recipes;
      })
      .catch((err) => {
        throw `yummly api: ${err}`;
      });
  },
};
