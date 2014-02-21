var expect = require('chai').expect;
var Model  = require('../mocks/model');

describe('Resource', function () {
  'use strict';

  var model;
  beforeEach(function () {
    model = new Model();
  });

  describe('.authorization', function () {

    it('defaults to full authorization', function () {
      expect(model).to.have.deep.property('authorization.all', true);
      expect(model).to.have.deep.property('authorization.read', true);
      expect(model).to.have.deep.property('authorization.write', true);
    });

  });

  // describe('.authorize', function () {

  //   // describe('#writes');
  //   // describe()
  // })

});