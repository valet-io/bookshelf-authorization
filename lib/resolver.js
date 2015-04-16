'use strict';

var _       = require('lodash');
var helpers = require('./helpers');

module.exports = {

  resolve: function (user, method, target) {
    var authorization = this.authorization(target);
    var userCtor = this.userCtor(user);

    return this.rules(authorization.rules, userCtor, method);
  },

  authorization: function (target) {
    if (_.isString(target) && this.model) {
      target = this.model(target);
    }
    if (helpers.isModel(target)) {
      return target.constructor.authorization;
    } else if (helpers.isCtor(target)) {
      return target.authorization;
    } else {
      throw new Error('Invalid authorization target');
    }
  },

  userCtor: function (user) {
    if (_.isString(user) && this.model) {
      user = this.model(user);
    }
    if (helpers.isModel(user)) {
      return user.constructor;
    } else if (helpers.isCtor(user)) {
      return user;
    } else {
      throw new Error('Invalid user');
    }
  },

  rules: function (rules, user, method) {
    return (rules || [])
      .filter(function (rule) {
        return (!rule.user || rule.user === user) && rule.method === method;
      });
  }

};
