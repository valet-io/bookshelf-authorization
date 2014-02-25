'use strict';

var expect    = require('chai').expect;
var ModelBase = require('../mocks/model');
var UserBase  = require('../mocks/user');
var resolver  = require('../../lib/resolver');

describe('Rule Resolver', function () {

  var Model;
  beforeEach(function () {
    Model = ModelBase.extend();
  });

  describe('#resolve', function () {

    it('resolves the authorization tests for a given user, method, target', function () {
      Model.authorization = {};
      Model.authorization.rules = [{method: 'write', user: UserBase}];
      expect(resolver.resolve(UserBase, 'write', Model)).to.have.length(1);
    });

  });

  describe('#authorization', function () {

    it('returns the authorization from constructor for a Model instance', function () {
      expect(resolver.authorization(new Model())).to.equal(Model.authorization);
    });

    it('returns the authorization on a ctor', function () {
      expect(resolver.authorization(Model)).to.equal(Model.authorization);
    });

    it('throws if the target is not an instance or ctor', function () {
      expect(resolver.authorization.bind(resolver)).to.throw(/Invalid authorization target/);
    });

  });

  describe('#userCtor', function () {

    it('returns the constructor for an instance', function () {
      expect(resolver.userCtor(new UserBase())).to.equal(UserBase);
    });

    it('returns the input if it is a constructor', function () {
      expect(resolver.userCtor(UserBase)).to.equal(UserBase);
    });

    it('throws if the user is not an instance or ctor', function () {
      expect(resolver.userCtor.bind(resolver)).to.throw(/Invalid user/);
    });

  });

  describe('#rules', function () {
    var User, User2;
    beforeEach(function () {
      User = UserBase.extend();
      User2 = UserBase.extend();
    });

    it('includes items with matching users', function () {
      expect(resolver.rules([{user: User}], User))
        .to.have.length(1);
    });

    it('excludes items with non-matching users', function () {
      expect(resolver.rules([{user: User}], User2))
        .to.be.empty;
    });

    it('includes items with matching methods', function () {
      expect(resolver.rules([{method: 'write'}], undefined, 'write'))
        .to.have.length(1);
    });

    it('excludes items with non-matching methods', function () {
      expect(resolver.rules([{method: 'write'}], undefined, 'read'))
        .to.be.empty;
    });

    it('can handle empty input', function () {
      expect(resolver.rules()).to.be.empty;
    });

  });

});