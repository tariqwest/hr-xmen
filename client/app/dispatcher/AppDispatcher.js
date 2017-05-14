const Dispatcher = require('flux').Dispatcher;
const AppDispatcher = new Dispatcher();

AppDispatcher.handleAction = function (action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action,
  });
};

module.exports = AppDispatcher;
