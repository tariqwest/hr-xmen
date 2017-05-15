const AppDispatcher = require('../dispatcher/AppDispatcher');
const appConstants = require('../constants/appConstants');

const photoActions = {
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
  addLocation(location) {
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_LOCATION,
      data: location,
    });
  },
  addUsername(username) {
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_USERNAME,
      data: username,
    });
  },
};

module.exports = photoActions;
