const AppDispatcher = require('../dispatcher/AppDispatcher');
const appConstants = require('../constants/appConstants');
// var objectAssign = require('react/lib/Object.assign');
const EventEmitter = require('events').EventEmitter;

const CHANGE_EVENT = 'change';

const _store = {
  list: [],
  current: [],
  location: {},
};

const addItem = function (item) {
  _store.list = item;
};

const addCurrent = function (current) {
  _store.current = current;
};

const addLocation = function (location) {
  _store.location = location;
};

const photoStore = Object.assign({}, EventEmitter.prototype, {
  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  },
  getList() {
    return _store.list;
  },
  getCurrent() {
    return _store.current;
  },
  getLocation() {
    return _store.location;
  },
});

AppDispatcher.register(function (payload) {
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
    default:
      return true;
  }
});

module.exports = photoStore;
