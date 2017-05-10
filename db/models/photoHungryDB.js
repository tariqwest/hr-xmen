var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/photoHungryDB');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var photoHungrySchema = mongoose.Schema(
  {   
  	picture_url: 'String',
    recipe_url: 'String',
    restaurant: { 
      name: 'String',
      phone: 'String',
      address: 'String',
      menuItemName: 'String',
      },
    user_record: 'String',
  }
);

var fsresult = mongoose.model('fsresult', photoHungrySchema);

module.exports.fsresult = fsresult;


