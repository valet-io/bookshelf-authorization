'use strict';

var Builder = require('./builder');

module.exports = function (ModelBase) {
  var Model = ModelBase.extend();

  Model.authorization = {
    rules: []
  };

  Object.defineProperty(Model, 'authorize', {
    enumerable: true,
    get: function () {
      return Builder.create(this.authorization.rules);
    }
  });    

  Model.extend = function () {
    var Extended = ModelBase.extend.apply(Model, arguments);
    Extended.authorization = {
      rules: []
    };
    return Extended;
  };

  return Model;
};