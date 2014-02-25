'use strict';

var expect    = require('chai').expect;
var sinon     = require('sinon');
var ModelBase = require('../mocks/model');
var UserBase  = require('../mocks/user');
var Builder   = require('../../lib/builder');

describe('Model', function () {

  var Model;
  beforeEach(function () {
    Model = ModelBase.extend();
  });

  describe('.authorization', function () {

    describe('.rules', function () {

      it('is empty by default', function () {
        expect(Model).to.have.deep.property('authorization.rules')
          .that.is.empty;
      });

    });

  });

  describe('#authorize', function () {

    it('returns a new rule builder', function () {
      expect(Model.authorize(UserBase)).to.be.an.instanceOf(Builder);
    });

    it('calls the builder with the User and rule target', function () {
      sinon.spy(Builder, 'create');
      Model.authorize(UserBase);
      expect(Builder.create).to.have.been.calledWith(UserBase, Model.authorization.rules);
    });

  });

  describe('#extend', function () {

    it('resets the authorization', function () {
      var Parent = Model.extend();
      Parent.authorization.rules.push();
      var Child = Parent.extend();
      expect(Child)
        .to.have.deep.property('authorization.rules')
        .that.is.empty;
    });

  });

  // describe('.authorize', function () {

  //   // describe('#writes');
  //   // describe()
  // })

});