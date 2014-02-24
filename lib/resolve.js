'use strict';

module.exports = function (ModelBase) {
  var resolve = function (user, method, target) {

    var authorization = resolve.authorization(target);
    var userCtor = resolve.userCtor(user);

    return resolve.rules(authorization, userCtor, method);
  };

  resolve.authorization = function (target) {
    if (resolve.isModel(target)) {
      return target.authorization;
    } else if (resolve.isCtor(target)) {
      /* jshint newcap:false */
      return new target().authorization;
    } else {
      throw new Error('Invalid authorization target');
    }
  };

  resolve.userCtor = function (user) {
    if (resolve.isModel(user)) {
      return user.constructor;
    } else if (resolve.isCtor(user)) {
      return user;
    } else {
      throw new Error('Invalid user');
    }
  };

  resolve.rules = function (rules, user, method) {
    return rules
      .filter(function (rule) {
        return rule.user === user && rule.method === method;
      })
      .reduce(function (rules, rule) {
        rules.push(rule.test);
        return rules;
      }, []);
  };

  resolve.isModel = function (input) {
    return input instanceof ModelBase;
  };

  resolve.isCtor = function (input) {
    return input && typeof input.extend === 'function';
  };

  return resolve;
};