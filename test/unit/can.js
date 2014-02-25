var expect    = require('chai').expect;
var sinon     = require('sinon');
var Promise   = require('bluebird');
var ModelBase = require('../mocks/model');
var UserBase  = require('../mocks/user');
var Rule      = require('../../lib/rule');
var Can       = require('../../lib/can');
var resolver  = require('../../lib/resolver');

describe('Can', function () {

  describe('constructor', function () {

    it('stores the source model', function () {
      expect(new Can(UserBase)).to.have.property('_user', UserBase);
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
      new Can(UserBase).do('write', ModelBase);
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

  });

});