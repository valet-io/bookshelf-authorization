'use strict';

var expect             = require('chai').expect;
var Promise            = require('bluebird');
var Rule               = require('../../lib/rule');
var AuthorizationError = require('../../lib/error');

describe('Rule', function () {

  describe('constructor', function () {

    it('accepts boolean rules', function () {
      expect(new Rule(false)).to.have.property('rule', false);
    });

    it('accepts function rules', function () {
      var fn = function () {};
      expect(new Rule(fn)).to.have.property('rule', fn);
    });

    it('rejects invalid rules', function () {
      expect(function () {
        new Rule(null);
      }).to.throw(/Invalid authorization rule/);
    });

    describe('#type', function () {

      it('returns the rule type', function () {
        expect(new Rule(true)).to.have.property('type', 'boolean');
      });

    });

    describe('#test', function () {

      it('resolves when rule === true', function () {
        return new Rule(true).test();
      });

      it('rejects when rule === false', function () {
        return expect(new Rule(false).test())
          .to.be.rejectedWith(AuthorizationError);
      });

      describe('rule = fn', function () {

        it('rejects when fn() === false', function () {
          return expect(new Rule(function () {
            return false;
          }).test())
          .to.be.rejectedWith(AuthorizationError);
        });

        it('resolves when fn() == true', function () {
          return new Rule(function () {
            return true;
          })
          .test()
          .then(function (value) {
            expect(value).to.be.null;
          });
        });

        it('resolves when fn() is a resolved promise', function () {
          return new Rule(function () {
            return Promise.resolve('resolution');
          })
          .test()
          .then(function (value) {
            expect(value).to.be.null;
          });
        });

        it('rejects when fn() is a rejected promise', function () {
          return expect(new Rule(function () {
            return Promise.reject(new Error('reason'));
          }).test())
          .to.be.rejectedWith(AuthorizationError, 'reason');
        });

        it('rejects when fn throws', function () {
          return expect(new Rule(function () {
            throw new Error('reason');
          }).test())
          .to.be.rejectedWith(AuthorizationError, 'reason');
        });

      });

    });

  });

});