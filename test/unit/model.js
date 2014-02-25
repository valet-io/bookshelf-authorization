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
      expect(model).to.have.property('authorization')
        .that.is.empty;
    });

  });

  // describe('.authorize', function () {

  //   // describe('#writes');
  //   // describe()
  // })

});