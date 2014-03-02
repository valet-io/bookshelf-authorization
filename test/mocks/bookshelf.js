module.exports = {
  Model: require('bookshelf/dialects/base/model').ModelBase,
  Collection: require('bookshelf/dialects/base/collection').CollectionBase,
  plugin: function (plugin) {
    plugin(this);
    return this;
  }
};