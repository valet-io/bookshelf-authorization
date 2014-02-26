'use strict';

var _       = require('lodash');
var methods = require('./methods');
var Rule    = require('./rule');
var helpers = require('./helpers');

var Builder = function (rules) {
  this._rules = rules;
};

Builder.create = function (rules) {
  return new Builder(rules);
};

// Declare internals, spumko-style
var internals = {};

Builder.prototype.a = Builder.prototype.an = function (User) {
  if (!helpers.isCtor(User) || !User.can) {
    throw new Error('Invalid user');
  }
  this._user = User;
  return this;
};

Object.defineProperty(Builder.prototype, 'anyone', {
  enumerable: true,
  get: function () {
    return this;
  }
});

Object.defineProperty(Builder.prototype, 'to', {
  get: function () {
    var to = function (method) {
      this._method = method;
      return this;
    }.bind(this);

    methods.forEach(function (method) {
      Object.defineProperty(to, method, {
        get: function () {
          return to(method);
        }
      });
    });

    to.administer = function () {
      return to(methods).always();
    };

    return to;
  }
});

Builder.prototype.always = function () {
  internals.apply.call(this, true);
};

Builder.prototype.never = function () {
  internals.apply.call(this, false);
};

Builder.prototype.when = function (fn) {
  internals.apply.call(this, fn);
};

internals.apply = function (test) {
  var methods = _.isArray(this._method) ? this._method : [this._method];
  methods.forEach(function (method) {
    this._rules.push(new Rule(test, method, this._user));
  }, this);
};

module.exports = Builder;