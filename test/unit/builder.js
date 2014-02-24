'use strict';

var expect      = require('chai').expect;
var sinon       = require('sinon');
var RuleBuilder = require('../../lib/builder');

describe('RuleBuilder', function () {

  var builder;
  beforeEach(function () {
    builder = new RuleBuilder({});
  });

  describe('constructor', function () {

    it('stores the target Model', function () {
      expect(new RuleBuilder('M')).to.have.property('_target', 'M');
    });

    it('stores the method', function () {
      expect(new RuleBuilder({}, 'read')).to.have.property('_method', 'read');
    });

    it('sets the default authorization if none is present', function () {
      expect(new RuleBuilder({})).to.have.deep.property('_target.authorization.all', true);
    })

  });

  describe('#for', function () {

    it('sets the User', function () {
      expect(builder.for('U')).to.have.property('_user', 'U');
    });

    it('returns the builder for chaining', function () {
      expect(builder.for()).to.be.an.instanceOf(RuleBuilder);
    });

  });

  describe('rules', function () {
    var apply;
    beforeEach(function () {
      apply = sinon.stub(builder, '_apply');
    });

    afterEach(function () {
      apply.restore();
    });

    describe('#always', function () {

      it('applies the rule as true', function () {
        builder.always();
        sinon.assert.calledWith(apply, true);
      });

    });

    describe('#never', function () {

      it('applies the rule as false', function () {
        builder.never();
        sinon.assert.calledWith(apply, false);
      });

    });

    describe('#when', function () {

      it('applies a function rule', function () {
        var fn = function () {};
        builder.when(fn);
        sinon.assert.calledWith(apply, fn);
      });

      it('enforces the presence of a function', function () {
        expect(builder.when).to.throw();
      });

    });

  });

  describe('#_apply', function () {

    beforeEach(function () {
      builder._method = 'read';
    });

    it('sets the rule on the method when no user is present', function () {
      builder._apply('r');
      expect(builder._target.authorization.read).to.equal('r');
    });

    it('sets the rule on the user if present', function () {
      builder._user = 'U';
      builder._apply('r');
      expect(builder._target.authorization.read.U).to.equal('r');
    });

  });

});