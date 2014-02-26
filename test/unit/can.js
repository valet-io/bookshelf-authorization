'use strict';

var expect             = require('chai').expect;
var sinon              = require('sinon');
var ModelBase          = require('../mocks/model');
var UserBase           = require('../mocks/user');
var Rule               = require('../../lib/rule');
var Can                = require('../../lib/can');
var resolver           = require('../../lib/resolver');
var AuthorizationError = require('../../lib/resolver');

describe('Can', function () {

  var can;
  beforeEach(function () {
    can = new Can(UserBase);
  });

  describe('constructor', function () {

    it('stores the source model', function () {
      expect(can).to.have.property('_user', UserBase);
    });

    it('generates convenience #do methods for Can.methods', function () {
      sinon.stub(Can.prototype, 'do');
      can = new Can(UserBase);
      expect(can).to.respondTo('write');
      expect(can).to.respondTo('read');
      can.write(ModelBase);
      expect(can.do).to.have.been.calledWith('write', ModelBase);
      expect(can.do).to.have.been.calledOn(can);
      Can.prototype.do.restore();
    });
    
  });

  describe('Can#create', function () {

    it('creates an new Can instance', function () {
      expect(Can.create(true))
        .to.be.an.instanceOf(Can)
        .and.to.have.property('_user', true);
    });

  });

  describe('#do', function () {

    beforeEach(function () {
      sinon.stub(resolver, 'resolve');
    });

    afterEach(function () {
      resolver.resolve.restore();
    });

    it('passes the user, method, and target to the rule resolver', function () {
      resolver.resolve.returns([]);
      can.do('write', ModelBase).catch(function () {});
      expect(resolver.resolve).to.have.been.calledWith(UserBase, 'write', ModelBase);
    });

    it('runs each rule', function () {
      var rule = new Rule(true);
      sinon.spy(rule, 'run');
      resolver.resolve.returns([rule]);
      return new Can(UserBase)
        .do('write', ModelBase)
        .finally(function () {
          expect(rule.run).to.have.been.calledWith(UserBase, ModelBase);
        });
    });

    it('resolves if all rules resolves', function () {
      resolver.resolve.returns([new Rule(true), new Rule(true)]);
      return new Can(UserBase).do('write', ModelBase);
    });

    it('resolves with null if resolving', function () {
      resolver.resolve.returns([new Rule(true)]);
      return new Can(UserBase).do('write', ModelBase)
        .then(function (value) {
          expect(value).to.be.null;
        });
    });

    it('rejects if only a single rule rejects', function () {
      resolver.resolve.returns([new Rule(false), new Rule(true)]);
      return expect(new Can(UserBase).do('write', ModelBase))
        .to.be.rejectedWith(AuthorizationError);
    });

    it('rejects if no rules match', function () {
      resolver.resolve.returns([]);
      return expect(new Can(UserBase).do('write', ModelBase))
        .to.be.rejectedWith(AuthorizationError, /No rules matched/);
    });

    it('can allow no matching rules using required: false', function () {
      resolver.resolve.returns([]);
      return new Can(UserBase).do('write', ModelBase, {
        required: false
      });
    });

  });

});