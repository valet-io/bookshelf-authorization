var expect    = require('chai').expect;
var _         = require('lodash');
var UserBase  = require('../mocks/user');
var ModelBase = require('../mocks/model');

describe('Integration: Configuration API', function () {

  var Model, User, fn;
  beforeEach(function () {
    Model = ModelBase.extend();
    User = UserBase.extend();
  });

  describe('User', function () {

    it('can authorize a user to do anything', function () {
      Model.authorize(User).always();
      var rule = Model.authorization.rules[0];
      expect(rule).to.have.property('test', true);
      expect(rule).to.have.property('user', User);
    });

    it('can prevent a user from doing anything', function () {
      Model.authorize(User).never();
      var rule = Model.authorization.rules[0];
      expect(rule).to.have.property('test', false);
    });

    it('can validate all user actions with a function', function () {
      var fn = function () {};
      Model.authorize(User).when(fn);
      var rule = Model.authorization.rules[0];
      expect(rule).to.have.property('test', fn);
    });

  });

});