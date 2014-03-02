'use strict';

var modelFactory = require('./model');
var userFactory  = require('./user');
var resolver     = require('./resolver');

module.exports = function (bookshelf, options) {
  options = options || {};
  var base = options.base || bookshelf;
  base.Model = modelFactory(base.Model);
  base.User = userFactory(base.Model);

  if (bookshelf.model) {
    resolver.model = bookshelf.model.bind(bookshelf);
    resolver.collection = bookshelf.collection.bind(bookshelf);
  }
};