var RuleBuilder = require('./builder');

module.exports = function (ModelBase) {
  'use strict';
  var Model = ModelBase.extend({
    authorization: []
  },
  {
    authorize: function (method) {
      return new RuleBuilder(this.prototype, method);
    }
  });

  return Model;
};