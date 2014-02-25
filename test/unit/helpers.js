var expect    = require('chai').expect;
var helpers   = require('../../lib/helpers');
var ModelBase = require('../mocks/model');
var UserBase  = require('../mocks/user');

describe('Helpers', function () {

  describe('#isModel', function () {

    it('checks whether the input is a model instance', function () {
      expect(helpers.isModel(ModelBase)).to.be.false;
      expect(helpers.isModel(new ModelBase())).to.be.true;
    });

    it('can handle empty input', function () {
      expect(helpers.isModel).to.not.throw();
    });

  });

  describe('#isCtor', function () {

    it('checks whether the input is a model constructor', function () {
      expect(helpers.isCtor(ModelBase)).to.be.true;
      expect(helpers.isCtor(new ModelBase())).to.be.false;
    });

    it('can handle empty input', function () {
      expect(helpers.isCtor).to.not.throw();
    });

  });

});