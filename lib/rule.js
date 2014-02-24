'use strict';

var Promise            = require('bluebird');
var AuthorizationError = require('./error');

var Rule = function (test) {
  if (typeof test !== 'boolean' && typeof test !== 'function') {
    throw new Error('Invalid authorization test (tests must be either booleans or functions)');
  }
  this.test = test;
};

Object.defineProperty(Rule.prototype, 'type', {
  get: function () {
    return typeof this.test;
  }
});

Rule.prototype.run = Promise.method(function () {
  var test = this.test;
  if (test === true) {
    return;
  } else if (test === false) {
    throw new AuthorizationError();
  } else {
    return Promise
      .method(test)()
      .catch(function (err) {
        throw new AuthorizationError(err.message);
      })
      .then(function (value) {
        if (value === false) {
          throw new AuthorizationError();
        }
      })
      .return(null);
  }
});

module.exports = Rule;