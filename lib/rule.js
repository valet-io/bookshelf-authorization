'use strict';

var Promise            = require('bluebird');
var AuthorizationError = require('./error');

var Rule = function (test, method, user) {
  if (typeof test !== 'boolean' && typeof test !== 'function') {
    throw new Error('Invalid authorization test (tests must be either booleans or functions)');
  }
  this.test = test;
  this.method = method;
  this.user = user;
};

Object.defineProperty(Rule.prototype, 'type', {
  get: function () {
    return typeof this.test;
  }
});

Rule.prototype.run = Promise.method(function (user, target) {
  var test = this.test;
  if (test === true) {
    return;
  } else if (test === false) {
    throw new AuthorizationError();
  } else {
    return Promise
      .method(test.bind(target))(user)
      .catch(function (err) {
        throw new AuthorizationError(err.message);
      })
      .then(function (value) {
        if (typeof value === 'undefined' || value == false || (value && value.length && !value.length)) {
          throw new AuthorizationError();
        }
      })
      .return(null);
  }
});

module.exports = Rule;