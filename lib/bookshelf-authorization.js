var ModelFactory = require('./model');
var UserFactory  = require('./user');

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
    Model = ModelFactory(ModelBase);
    User = UserFactory(Model);
    return {
      Model: Model,
      User: User
    };
  } else {
    // Otherwise use Bookshelf's ModelBase and assume we're running through
    // bookshelf.plugin. Append the bases to bookshelf because
    // bookshelf.plugin does not pass through module return values.
    bookshelf.Model = ModelFactory(bookshelf.Model);
    bookshelf.User = UserFactory(bookshelf.Model);
  }
};