const AppDispatcher = require('../dispatcher/AppDispatcher');
const appConstants = require('../constants/appConstants');
// var objectAssign = require('react/lib/Object.assign');
const EventEmitter = require('events').EventEmitter;

const CHANGE_EVENT = 'change';

const store = {
  list: [],
  current: [],
  location: {},
  username: {},
};

const addItem = function (item) {
  store.list = item;
};

const addCurrent = function (current) {
  store.current = current;
};

const addLocation = function (location) {
  store.location = location;
};

const addUsername = function (username) {
  store.username = username;
};

const photoStore = Object.assign({}, EventEmitter.prototype, {
  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  },
  getList() {
    return store.list;
  },
  getCurrent() {
    return store.current;
  },
  getLocation() {
    return store.location;
  },
  getUsername() {
    return store.username;
  },
});

AppDispatcher.register(payload => {
  const action = payload.action;
  switch (action.actionType) {
    case appConstants.ADD_ITEM:
      addItem(action.data);
      photoStore.emit(CHANGE_EVENT);
      break;
    case appConstants.ADD_CURRENT:
      addCurrent(action.data);
      photoStore.emit(CHANGE_EVENT);
      break;
    case appConstants.ADD_LOCATION:
      addLocation(action.data);
      photoStore.emit(CHANGE_EVENT);
      break;
    case appConstants.ADD_USERNAME:
      addUsername(action.data);
      photoStore.emit(CHANGE_EVENT);
      break;
    default:
      return true;
  }
});

module.exports = photoStore;
