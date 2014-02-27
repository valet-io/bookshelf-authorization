'use strict';

var expect = require('chai').expect;
var sinon  = require('sinon');
var Can    = require('../../lib/can');
var Model  = require('../mocks/model');
var User   = require('../mocks/user');

describe('UserBase', function () {

  beforeEach(function () {
    sinon.spy(Can, 'create');
  });

  afterEach(function () {
    Can.create.restore();
  });

  describe('User', function () {

    describe('#can', function () {

      it('returns a Can instance for the User constructor', function () {
        expect(User.can).to.be.an.instanceOf(Can);
        expect(Can.create).to.have.been.calledWith(User);
      });
      
    });

    describe('#extend', function () {

      var Parent, Child;
      beforeEach(function () {
        Parent = User.extend({
          protoMethod: function () {}
        });
        Child = Parent.extend();
      });

      it('applies the can getter', function () {
        expect(Child).to.have.property('can');
      });

      it('preserves the normal behavior', function () {
        expect(Child).to.respondTo('protoMethod');
      });

    });

  });

  describe('user', function () {

    var user;
    beforeEach(function () {
      user = new User();
    });

    it('inherits from ModelBase', function () {
      expect(user).to.be.an.instanceOf(Model);
    });

    describe('#can', function () {

      it('returns a Can instance for the user', function () {
        expect(user.can).to.be.an.instanceOf(Can);
        expect(Can.create).to.have.been.calledWith(user);
      });

    });

  });

});