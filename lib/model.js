'use strict';

var Builder = require('./builder');

var internals = {};

internals.defineAuthorization = function (Target) {
  Object.defineProperty(Target, 'authorize', {
    enumerable: true,
    get: function () {
      return Builder.create(this.authorization.rules);
    }
  });  
};

module.exports = function (ModelBase) {
  var Model = ModelBase.extend();

  Model.authorization = {
    rules: []
  };

  internals.defineAuthorization(Model);    

  Model.extend = function () {
    var Extended = ModelBase.extend.apply(Model, arguments);
    Extended.authorization = {
      rules: []
    };
    internals.defineAuthorization(Extended);
    return Extended;
  };

  return Model;
};