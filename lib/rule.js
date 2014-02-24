'use strict';

var Promise            = require('bluebird');
var AuthorizationError = require('./error');

var Rule = function (rule) {
  if (typeof rule !== 'boolean' && typeof rule !== 'function') {
    throw new Error('Invalid authorization rule (rules must be either booleans or functions)');
  }
  this.rule = rule;
};

Object.defineProperty(Rule.prototype, 'type', {
  get: function () {
    return typeof this.rule;
  }
});

Rule.prototype.test = Promise.method(function () {
  var rule = this.rule;
  if (rule === true) {
    return;
  } else if (rule === false) {
    throw new AuthorizationError();
  } else {
    return Promise
      .method(rule)()
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