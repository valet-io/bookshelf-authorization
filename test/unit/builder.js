'use strict';

var expect   = require('chai').expect;
var sinon    = require('sinon');
var UserBase = require('../mocks/user');
var Builder  = require('../../lib/builder');
var methods  = require('../../lib/methods');

describe('Builder', function () {

  var builder, rules;
  beforeEach(function () {
    rules = [];
    builder = new Builder(rules);
  });

  describe('Builder#create', function () {

    it('creates a new Builder', function () {
      var b = Builder.create(rules);
      expect(b)
        .to.be.an.instanceOf(Builder)
        .and.have.property('_rules', rules);
    });

  });

  describe('constructor', function () {

    it('stores the target for new rules', function () {
      expect(builder)
        .to.have.property('_rules')
        .that.equals(rules);
    });

  });

  describe('#a / #an', function () {
    ['a', 'an'].forEach(function (method) {

      it('checks that the User is a ctor w/ #can', function () {
        expect(builder[method]).to.throw(/Invalid user/);
        expect(builder[method].bind(builder, new UserBase())).to.throw(/Invalid user/);
      });

      it('stores the User', function () {
        expect(builder.a(UserBase)).to.have.property('_user', UserBase);
      });

    });
  });

  describe('#anyone (getter)', function () {

    it('passes through the builder (sugar)', function () {
      expect(builder.anyone).to.equal(builder);
    });

  });

  describe('#to', function () {

    it('sets the method', function () {
      expect(builder.to('write')).to.have.property('_method', 'write');
    });

    it('can set an array of methods', function () {
      expect(builder.to(methods)).to.have.property('_method', methods);
    });

    it('returns the builder for chaining', function () {
      expect(builder.to()).to.equal(builder);
    });

    it('has method properties for extra sugar', function () {
      expect(builder.to.write)
        .to.equal(builder)
        .and.have.property('_method', 'write');
    });

  });

  describe('#administer', function () {

    it('sets all methods to allow always', function () {
      builder.to.administer();
      expect(rules)
        .to.have.length(methods.length)
        .and.all.have.property('test', true);
    });

  });

  describe('rule setters', function () {

    it('applies rules for each method', function () {
      builder.to(methods).always();
      expect(rules)
        .to.have.length(methods.length)
        .and.all.have.property('test', true);
    });

    describe('#always', function () {

      it('pushes a new rule with test = true', function () {
        builder.always();
        expect(rules)
          .to.have.property(0)
          .with.property('test', true);
      });

    });

    describe('#never', function () {

      it('pushes a new rule with test = false', function () {
        builder.never();
        expect(rules)
          .to.have.property(0)
          .with.property('test', false);
      });

    });

    describe('#when', function () {

      it('pushes a new rule with test = fn', function () {
        var fn = function () {};
        builder.when(fn);
        expect(rules)
          .to.have.property(0)
          .with.property('test', fn);
      });

    });

  });

});