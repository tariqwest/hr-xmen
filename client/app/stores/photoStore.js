var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
// var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  list: [],
  current: []
};

var addItem = function(item){
  _store.list = item;
};

var addCurrent = function(current){
  _store.current = current;
};

var photoStore = Object.assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },
  getList: function(){
    return _store.list;
  },
  getCurrent: function(){
    return _store.current;
  },
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case appConstants.ADD_ITEM:
      addItem(action.data);
      photoStore.emit(CHANGE_EVENT);
      break;
    case appConstants.ADD_CURRENT:
      addCurrent(action.data);
      photoStore.emit(CHANGE_EVENT);
      break;
    default:
      return true;
  }
});

module.exports = photoStore;
