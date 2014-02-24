var modelFactory = require('./model');
var userFactory  = require('./user');

module.exports = function (bookshelf, ModelBase) {
  'use strict';

  if (!bookshelf.model) {
    bookshelf.plugin(require('bookshelf/plugins/registry'));
  }

  var Model, User;
  if (ModelBase) {
    // When providing a custom ModelBase, return the User & Resource bases. A
    // custom ModelBase cannot be provided through the bookshelf.plugin
    // interface
    Model = modelFactory(ModelBase);
    User = userFactory(Model);
    return {
      Model: Model,
      User: User
    };
  } else {
    // Otherwise use Bookshelf's ModelBase and assume we're running through
    // bookshelf.plugin. Append the bases to bookshelf because
    // bookshelf.plugin does not pass through module return values.
    bookshelf.Model = modelFactory(bookshelf.Model);
    bookshelf.User = userFactory(bookshelf.Model);
  }
};