var RuleBuilder = require('./builder');

module.exports = function (ModelBase) {
  'use strict';
  var Model = ModelBase.extend({
    authorization: {
      all: true,
      read: true,
      write: true
    }
  },
  {
    authorize: function (method) {
      return new RuleBuilder(this.prototype, method);
    }
  });

  return Model;
};