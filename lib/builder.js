'use strict';

var RuleBuilder = function (Target, method) {
  this._target = Target;
  this._target.authorization = this._target.authorization || {
    all: true,
    write: true,
    read: true
  };
  this._method = method;
};

RuleBuilder.prototype.for = function (User) {
  this._user = User;
  return this;
};

RuleBuilder.prototype.always = function () {
  this._apply(true);
};

RuleBuilder.prototype.never = function () {
  this._apply(false);
};

RuleBuilder.prototype.when = function (fn) {
  if (typeof fn !== 'function') {
    throw new Error('when accepts a function to check authorization');
  }
  this._apply(fn);
};

RuleBuilder.prototype._apply = function (rule) {
  if (this._user) {
    this._target.authorization[this._method] = {};
    this._target.authorization[this._method][this._user] = rule;
  } else {
    this._target.authorization[this._method] = rule;
  }
};

module.exports = RuleBuilder;