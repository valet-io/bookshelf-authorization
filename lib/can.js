'use strict';

var Promise            = require('bluebird');
var _                  = require('lodash');
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

Can.prototype.do = function (method, target, options) {
  options = _.defaults(options || {}, {
    required: true
  });
  return Promise
    .resolve(resolver.resolve(this._user, method, target))
    .bind(this)
    .then(function (rules) {
      return (rules.length || !options.required) ? rules : Promise.reject(new AuthorizationError('No rules matched'));
    })
    .map(function (rule) {
      return rule.run(this._user, target);
    })
    .all()
    .return(null);
};

module.exports = Can;