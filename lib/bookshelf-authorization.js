'use strict';

var modelFactory = require('./model');
var userFactory  = require('./user');

module.exports = function (bookshelf) {
  var Model, User;
  Model = modelFactory(bookshelf.Model);
  User = userFactory(Model);
  bookshelf.Model = modelFactory(bookshelf.Model);
  bookshelf.User = userFactory(bookshelf.Model);
};