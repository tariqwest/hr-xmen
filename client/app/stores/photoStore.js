var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
// var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  photoList: [],
  currentPhoto: []
};

var addPhotos = function(item){
  _store.photoList.push(item);
};

var addCurrent = function(item){
  _store.currentPhoto = item;
};

var photoStore = Object.assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },
  getList: function(){
    return _store.photoList;
  },
  getCurrent: function(){
    return _store.currentPhoto;
  },
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case appConstants.ADD_PHOTOS:
      addPhotos(action.data);
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
