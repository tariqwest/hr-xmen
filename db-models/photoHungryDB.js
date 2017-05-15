const mongoose = require('mongoose');
mongoose.connect(process.env.ENV_DB);

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
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

const photoHungrySchema = mongoose.Schema(
  {
    photoURL: 'String',
    savedItem: 'Object', // restaurant or recipe
    userID: 'String', // _id from a user in user collection
  }
);

const dbuser = mongoose.model('photohungryuser', userSchema);

const saveditem = mongoose.model('saveditem', photoHungrySchema);

module.exports.saveditem = saveditem;
module.exports.dbuser = dbuser;
module.exports.db = db; 
