'use strict';

var Can = require('./can');

module.exports = function (ModelBase) {
  var User = ModelBase.extend();

  [User, User.prototype].forEach(function (user) {
    Object.defineProperty(user, 'can', {
      enumerable: true,
      get: function () {
        return Can.create(this);
      }
    });
  });

  return User;
};