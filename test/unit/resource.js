var expect   = require('chai').expect;
var Resource = require('../../lib/resource')(require('../mocks/model'));

describe('Resource', function () {
  'use strict';

  var resource;
  beforeEach(function () {
    resource = new Resource();
  });

  describe('.authorization', function () {

    it('defaults to full authorization', function () {
      expect(resource).to.have.deep.property('authorization.all', true);
      expect(resource).to.have.deep.property('authorization.read', true);
      expect(resource).to.have.deep.property('authorization.write', true);
    });

  });

  describe('.authorize', function () {

    // describe('#writes');
    // describe()
  })

  // describe('Resource#can')

});