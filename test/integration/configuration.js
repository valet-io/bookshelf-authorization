var expect    = require('chai').expect;
var _         = require('lodash');
var ModelBase = require('../../lib/model')(require('../mocks/model'));

describe('Integration: Configuration API', function () {

  var Model, fn;
  beforeEach(function () {
    Model = ModelBase.extend();
    fn = function () {};
  });

  describe('Operation', function () {

    it('can authorize an operation', function () {
      Model.prototype.authorization.read = false;
      Model.authorize('read').always();
      expect(Model.prototype.authorization.read).to.be.true;
    });

    it('can prevent an operation', function () {
      Model.authorize('read').never();
      expect(Model.prototype.authorization.read).to.be.false;
    });

    it('can define an authorization handler', function () {
      Model.authorize('read').when(fn);
      expect(Model.prototype.authorization.read).to.equal(fn);
    });

  });

});