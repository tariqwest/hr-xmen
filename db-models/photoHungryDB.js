var mongoose = require('mongoose');
mongoose.connect(process.env.ENV_DB);

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var userSchema = mongoose.Schema(
  {
    fbID: 'String',
    fbFirstName: 'String',
    fbLastName: 'String',
    fbToken: 'String'
  }
);

var photoHungrySchema = mongoose.Schema(
  {   
    photoURL: 'String', 
    savedItem: 'Object', // restaurant or recipe
    userID: 'String' // _id from a user in user collection
  }
);

var dbuser = mongoose.model('photohungryuser', userSchema);

var saveditem = mongoose.model('saveditem', photoHungrySchema);

module.exports.saveditem = saveditem;
module.exports.dbuser = dbuser;
