var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');

var photoActions = {
  addPhotos: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_PHOTOS,
      data: item
    });
  },
  addCurrent: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_CURRENT,
      data: item
    });
  }
};

module.exports = photoActions;
