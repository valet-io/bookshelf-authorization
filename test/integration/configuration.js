var expect    = require('chai').expect;
var _         = require('lodash');
var UserBase  = require('../mocks/user');
var ModelBase = require('../mocks/model');

describe('Integration: Configuration API', function () {

  var Model, User, fn;
  beforeEach(function () {
    Model = ModelBase.extend();
    User = UserBase.extend();
    fn = function () {};
  });

  var rules;
  beforeEach(function () {
    rules = function () {
      return Model.authorization.rules;
    };

    rules.ensureOne = function () {
      expect(rules()).to.have.length(1);
    };

    Object.defineProperty(rules, 'first', {
      enumerable: true,
      get: function () {
        return rules()[0];
      }
    });
  });

  afterEach(function () {
    rules.ensureOne();
  });

  describe('Top Level', function () {

    it('can authorize everything', function () {
      Model.authorize.always();
      expect(rules.first).to.have.property('test', true);
    });

    it('can prevent everything', function () {
      Model.authorize.never();
      expect(rules.first).to.have.property('test', false);
    });

    it('can validate everything with a function', function () {
      Model.authorize.when(fn);
      expect(rules.first).to.have.property('test', fn);
    });

  });

  describe('User', function () {

    afterEach(function () {
      expect(rules.first).to.have.property('user', User);
    });

    it('can allow a user to do anything', function () {
      Model.authorize.a(User).always();
      expect(rules.first).to.have.property('test', true);
    });

    it('can prevent a user from doing anything', function () {
      Model.authorize.a(User).never();
      expect(rules.first).to.have.property('test', false);
    });

    it('can validate user actions with a function', function () {
      Model.authorize.a(User).when(fn);
      expect(rules.first).to.have.property('test', fn);
    });

  });

  describe('Method', function () {

    afterEach(function () {
      expect(rules.first).to.have.property('method', 'write');
    });

    it('can validate all uses of any method', function () {
      Model.authorize.anyone.to('write').always();
      expect(rules.first).to.have.property('test', true);
    });

    it('can prevent all uses of a method', function () {
      Model.authorize.anyone.to('write').never();
      expect(rules.first).to.have.property('test', false);
    });

    it('can validate uses of a method with a function', function () {
      Model.authorize.anyone.to('write').when(fn);
      expect(rules.first).to.have.property('test', fn);
    });

    it('can use the chained syntax for registered methods', function () {
      Model.authorize.anyone.to.write.when(fn);
      expect(rules.first).to.have.property('test', fn);
    });

  });

});