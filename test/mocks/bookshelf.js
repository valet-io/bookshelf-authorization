module.exports = {
  Model: require('bookshelf/dialects/base/model').ModelBase,
  plugin: function (plugin) {
    plugin(this);
    return this;
  }
};