const mongoose = require('mongoose');
mongoose.connect(process.env.ENV_DB);

const connection = mongoose.connection;

connection.on('error', () => {
  console.log('mongoose connection error');
});

connection.once('open', () => {
  console.log('mongoose connected successfully');
});

const userSchema = mongoose.Schema(
  {
    fbID: 'String',
    fbFirstName: 'String',
    fbLastName: 'String',
    fbToken: 'String',
  }
);

const favoriteSchema = mongoose.Schema(
  {
    photoURL: 'String',
    savedItem: 'Object', // restaurant or recipe
    userID: 'String', // _id from a user in user collection
  }
);

const Users = mongoose.model('Users', userSchema);

const Favorites = mongoose.model('Favorites', favoriteSchema);

module.exports.Users = Users;
module.exports.Favorites = Favorites;
module.exports.connection = connection; 
