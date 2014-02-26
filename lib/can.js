'use strict';

var Promise            = require('bluebird');
var resolver           = require('./resolver');
var AuthorizationError = require('./error');
var methods            = require('./methods');

var Can = function (user) {
  this._user = user;
  methods.forEach(function (method) {
    this[method] = this.do.bind(this, method);
  }, this);
};

Can.create = function (user) {
  return new Can(user);
};

Can.prototype.do = function (method, target) {
  return Promise
    .resolve(resolver.resolve(this._user, method, target))
    .bind(this)
    .then(function (rules) {
      if (!rules.length) {
        throw new AuthorizationError('No authorization rules matched.');
      }
      return rules
    })
    .then(function (rules) {
      return rules.map(function (rule) {
        return rule.run(this._user, target);
      }, this);
    })
    .any()
    .catch(function (err) {
      throw err;
    });
};

module.exports = Can;