'use strict';

var expect    = require('chai').expect;
var sinon     = require('sinon');
var ModelBase = require('../mocks/model');
var UserBase  = require('../mocks/user');
var resolve   = require('../../lib/resolve')(ModelBase);

describe('Rule Resolver', function () {

  it('resolves the authorization tests for a given user, method, target', function () {
    var test = function () {};
    var Model = ModelBase.extend({
      authorization: [{method: 'write', user: UserBase, test: test}]
    });
    expect(resolve(UserBase, 'write', Model))
      .to.have.length(1)
      .and.to.have.property('0', test);
  });

  describe('#authorization', function () {

    it('returns the authorization from a model instance', function () {
      var target = new ModelBase();
      expect(resolve.authorization(target)).to.equal(target.authorization);
    });

    it('creates a constructor to access authorization on a ctor', function () {
      var Target = sinon.spy(ModelBase.extend());
      expect(resolve.authorization(Target)).to.equal(Target.prototype.authorization);
      sinon.assert.calledWithNew(Target);
    });

    it('throws if the target is not an instance or ctor', function () {
      expect(resolve.authorization).to.throw(/Invalid authorization target/);
    });

  });

  describe('#userCtor', function () {

    it('returns the constructor for an instance', function () {
      expect(resolve.userCtor(new UserBase())).to.equal(UserBase);
    });

    it('returns the input if it is a constructor', function () {
      expect(resolve.userCtor(UserBase)).to.equal(UserBase);
    });

    it('throws if the user is not an instance or ctor', function () {
      expect(resolve.userCtor).to.throw(/Invalid user/);
    });

  });

  describe('#rules', function () {
    var User, User2;
    beforeEach(function () {
      User = UserBase.extend();
      User2 = UserBase.extend();
    });

    it('includes items with matching users', function () {
      expect(resolve.rules([{user: User}], User))
        .to.have.length(1);
    });

    it('excludes items with non-matching users', function () {
      expect(resolve.rules([{user: User}], User2))
        .to.be.empty;
    });

    it('includes items with matching methods', function () {
      expect(resolve.rules([{method: 'write'}], undefined, 'write'))
        .to.have.length(1);
    });

    it('excludes items with non-matching methods', function () {
      expect(resolve.rules([{method: 'write'}], undefined, 'read'))
        .to.be.empty;
    });

    it('reduces to the tests', function () {
      expect(resolve.rules([{user: User}, {test: true}]))
        .to.have.length(1)
        .and.have.property('0', true);
    });

  });

  describe('#isModel', function () {

    it('checks whether the input is a model instance', function () {
      expect(resolve.isModel(ModelBase)).to.be.false;
      expect(resolve.isModel(new ModelBase())).to.be.true;
    });

    it('can handle empty input', function () {
      expect(resolve.isModel).to.not.throw();
    });

  });

  describe('#isCtor', function () {

    it('checks whether the input is a model constructor', function () {
      expect(resolve.isCtor(ModelBase)).to.be.true;
      expect(resolve.isCtor(new ModelBase())).to.be.false;
    });

    it('can handle empty input', function () {
      expect(resolve.isCtor).to.not.throw();
    });

  });

});