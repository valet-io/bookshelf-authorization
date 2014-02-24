'use strict';

var expect             = require('chai').expect;
var Promise            = require('bluebird');
var Rule               = require('../../lib/rule');
var AuthorizationError = require('../../lib/error');

describe('Rule', function () {

  describe('constructor', function () {

    it('accepts boolean tests', function () {
      expect(new Rule(false)).to.have.property('test', false);
    });

    it('accepts function tests', function () {
      var fn = function () {};
      expect(new Rule(fn)).to.have.property('test', fn);
    });

    it('rejects invalid tests', function () {
      expect(function () {
        new Rule(null);
      }).to.throw(/Invalid authorization test/);
    });

  });

  describe('#type', function () {

    it('returns the test type', function () {
      expect(new Rule(true)).to.have.property('type', 'boolean');
    });

  });

  describe('#eval', function () {

    it('resolves when test === true', function () {
      return new Rule(true).eval();
    });

    it('rejects when test === false', function () {
      return expect(new Rule(false).eval())
        .to.be.rejectedWith(AuthorizationError);
    });

    describe('test = fn', function () {

      it('rejects when fn() === false', function () {
        return expect(new Rule(function () {
          return false;
        }).eval())
        .to.be.rejectedWith(AuthorizationError);
      });

      it('resolves when fn() == true', function () {
        return new Rule(function () {
          return true;
        })
        .eval()
        .then(function (value) {
          expect(value).to.be.null;
        });
      });

      it('resolves when fn() is a resolved promise', function () {
        return new Rule(function () {
          return Promise.resolve('resolution');
        })
        .eval()
        .then(function (value) {
          expect(value).to.be.null;
        });
      });

      it('rejects when fn() is a rejected promise', function () {
        return expect(new Rule(function () {
          return Promise.reject(new Error('reason'));
        }).eval())
        .to.be.rejectedWith(AuthorizationError, 'reason');
      });

      it('rejects when fn throws', function () {
        return expect(new Rule(function () {
          throw new Error('reason');
        }).eval())
        .to.be.rejectedWith(AuthorizationError, 'reason');
      });

    });

  });

});