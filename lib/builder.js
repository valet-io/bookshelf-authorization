'use strict';

var Rule    = require('./rule');
var helpers = require('./helpers');

var Builder = function (User, rules) {
  this._user = User;
  this._rules = rules;
};

Builder.create = function (User, rules) {
  return new Builder(User, rules);
};

// Declare internals, spumko-style
var internals = {};

Builder.prototype.to = function (method) {
  this._method = method;
  return this;
};

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
  this._rules.push(new Rule(test, this._method, this._user));
};

module.exports = Builder;