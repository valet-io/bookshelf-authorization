'use strict';

var Can = require('./can');

var internals = {};

internals.applyUserProperties = function (target) {
  [target, target.prototype].forEach(internals.registerCan, this);
};

internals.registerCan = function (target) {
  Object.defineProperty(target, 'can', {
    enumerable: true,
    get: function () {
      return Can.create(this);
    }
  });
};

module.exports = function (ModelBase) {
  var User = ModelBase.extend();

  internals.applyUserProperties.call(this, User);

  User.extend = function () {
    var Extended = ModelBase.extend.apply(this, arguments);
    internals.applyUserProperties(Extended);
    return Extended;
  };

  return User;
};