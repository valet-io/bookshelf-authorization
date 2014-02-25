'use strict';

var expect    = require('chai').expect;
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

    it('has an alternate "an" syntax for grammar', function () {
      Model.authorize.an(User).always();
      expect(rules.first).to.have.property('test', true);
    });

  });

  describe('Method', function () {

    afterEach(function () {
      expect(rules.first).to.have.property('test', fn);
    });

    it('can validate all uses of any method', function () {
      Model.authorize.anyone.to('say').when(fn);
      expect(rules.first).to.have.property('method', 'say');
    });

    it('can use the chained syntax for write', function () {
      Model.authorize.anyone.to.write.when(fn);
      expect(rules.first).to.have.property('method', 'write');
    });

    it('can use the chained syntax for read', function () {
      Model.authorize.anyone.to.read.when(fn);
      expect(rules.first).to.have.property('method', 'read');
    });

  });

  describe('User + Method', function () {

    afterEach(function () {
      expect(rules.first).to.have.property('user', User);
      expect(rules.first).to.have.property('method', 'write');
    });

    it('can validate all method calls by a specific user', function () {
      Model.authorize.a(User).to.write.when(fn);
      expect(rules.first).to.have.property('test', fn);
    });

  });

});