'use strict';

var modelFactory = require('./model');
var userFactory  = require('./user');

module.exports = function (bookshelf, options) {
  options = options || {};
  var base = options.base || bookshelf;
  base.Model = modelFactory(base.Model);
  base.User = userFactory(base.Model);
};