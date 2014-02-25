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

  describe('#do', function () {

    beforeEach(function () {
      sinon.stub(resolver, 'resolve')
        .returns([new Rule(true)]);
    });

    afterEach(function () {
      resolver.resolve.restore();
    });

    it('passes the user, method, and target to the rule resolver', function () {
      new Can(UserBase).do('write', ModelBase);
      sinon.assert.calledWith(resolver.resolve, UserBase, 'write', ModelBase);
    });

  });

});