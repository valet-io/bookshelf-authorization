'use strict';

module.exports = function (ModelBase) {

  return {

    resolve: function (user, method, target) {
      var authorization = this.authorization(target);
      var userCtor = this.userCtor(user);

      return this.rules(authorization, userCtor, method);
    },

    authorization: function (target) {
      if (this.isModel(target)) {
        return target.authorization;
      } else if (this.isCtor(target)) {
        /* jshint newcap:false */
        return new target().authorization;
      } else {
        throw new Error('Invalid authorization target');
      }
    },

    userCtor: function (user) {
      if (this.isModel(user)) {
        return user.constructor;
      } else if (this.isCtor(user)) {
        return user;
      } else {
        throw new Error('Invalid user');
      }
    },

    rules: function (rules, user, method) {
      return (rules || [])
        .filter(function (rule) {
          return rule.user === user && rule.method === method;
        });
    },

    isModel: function (input) {
      return input instanceof ModelBase;
    },

    isCtor: function (input) {
      return input && typeof input.extend === 'function';
    }

  };

};