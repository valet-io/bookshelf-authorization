'use strict';

var expect             = require('chai').expect;
var sinon              = require('sinon');
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

    it('stores the method', function () {
      expect(new Rule(true, 'write'))
        .to.have.property('method', 'write');
    });

    it('stores the user', function () {
      expect(new Rule(true, 'write', 'U'))
        .to.have.property('user', 'U');
    });

  });

  describe('#type', function () {

    it('returns the test type', function () {
      expect(new Rule(true)).to.have.property('type', 'boolean');
    });

  });

  describe('#run', function () {

    it('resolves when test === true', function () {
      return new Rule(true).run();
    });

    it('rejects when test === false', function () {
      return expect(new Rule(false).run())
        .to.be.rejectedWith(AuthorizationError);
    });

    describe('test = fn', function () {

      it('calls the function with the user', function () {
        var stub = sinon.stub().returns(true);
        return new Rule(stub)
          .run('u')
          .finally(function () {
            expect(stub).to.have.been.calledWith('u');
          });
      });

      it('binds the function to the target', function () {
        var stub = sinon.stub().returns(true);
        return new Rule(stub)
          .run(null, 't')
          .finally(function () {
            expect(stub).to.have.been.calledOn('t');
          });
      });

      it('rejects when fn returns false', function () {
        return expect(new Rule(function () {
          return false;
        }).run())
        .to.be.rejectedWith(AuthorizationError);
      });

      it('rejects when fn returns falsy', function () {
        return expect(new Rule(function () {
          return '';
        }).run())
        .to.be.rejectedWith(AuthorizationError);
      });

      it('rejects when fn returns an empty array', function () {
        return expect(new Rule(function () {
          return [];
        }).run())
        .to.be.rejectedWith(AuthorizationError);
      });

      it('resolves when fn returns true', function () {
        return new Rule(function () {
          return true;
        })
        .run()
        .then(function (value) {
          expect(value).to.be.null;
        });
      });

      it('rejects when fn returns truthy', function () {
        return new Rule(function () {
          return 'truthy';
        })
        .run()
        .then(function (value) {
          expect(value).to.be.null;
        });
      });

      it('resolves when fn resolves truthy', function () {
        return new Rule(function () {
          return Promise.resolve('resolution');
        })
        .run()
        .then(function (value) {
          expect(value).to.be.null;
        });
      });

      it('rejects when fn rejects', function () {
        return expect(new Rule(function () {
          return Promise.reject(new Error('reason'));
        }).run())
        .to.be.rejectedWith(AuthorizationError, 'reason');
      });

      it('rejects when fn throws', function () {
        return expect(new Rule(function () {
          throw new Error('reason');
        }).run())
        .to.be.rejectedWith(AuthorizationError, 'reason');
      });

    });

  });

});