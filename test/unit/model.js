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

  describe('#authorize (getter)', function () {

    beforeEach(function () {
      sinon.spy(Builder, 'create');
    });

    afterEach(function () {
      Builder.create.restore();
    });

    it('returns a new rule builder', function () {
      expect(Model.authorize).to.be.an.instanceOf(Builder);
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