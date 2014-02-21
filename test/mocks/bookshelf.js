module.exports = {
  Model: require('./model'),
  plugin: function (plugin) {
    plugin(this);
    return this;
  }
};