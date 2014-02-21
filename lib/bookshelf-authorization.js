module.exports = function (bookshelf, ModelBase) {
  'use strict';

  if (!bookshelf.model) {
    bookshelf.plugin(require('bookshelf/plugins/registry'));
  }

  if (ModelBase) {
    // When providing a custom ModelBase, return the User & Resource bases. A
    // custom ModelBase cannot be provided through the bookshelf.plugin
    // interface
    return {
      User: require('./user')(ModelBase),
      Resource: require('./resource')(ModelBase)
    };
  } else {
    // Otherwise use Bookshelf's ModelBase and assume we're running through
    // bookshelf.plugin. Append the bases to bookshelf because
    // bookshelf.plugin does not pass through module return values.
    bookshelf.User = require('./user')(bookshelf.Model);
    bookshelf.Resource = require('./resource')(bookshelf.Model);
  }
};