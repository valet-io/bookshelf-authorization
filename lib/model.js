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

module.exports = function (Model) {
  if (Model.authorization) {
    return Model;
  }

  Model.authorization = {
    rules: []
  };

  internals.defineAuthorization(Model);    

  var extend = Model.extend;
  Model.extend = function () {
    var Extended = extend.apply(this, arguments);
    Extended.authorization = {
      rules: []
    };
    internals.defineAuthorization(Extended);
    return Extended;
  };

  return Model;
};