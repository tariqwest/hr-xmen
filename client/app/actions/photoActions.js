var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');

var photoActions = {
  addItem(item) {
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_ITEM,
      data: item,
    });
  },
  addCurrent(current) {
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_CURRENT,
      data: current,
    });
  },
};

module.exports = photoActions;
