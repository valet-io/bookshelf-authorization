var expect = require('chai').expect;
var method = require('../../lib/method');

describe('method', function () {

  it('must be registered', function () {
    expect(method.bind(null, 'i'))
      .to.be.throw(/not a valid method/);
  });

  describe('#methods', function () {

    it('returns the method hierarchy', function () {
      expect(method.methods()).to.deep.equal(['all', ['read', 'write'], []]);
    });

  });

  describe('#register', function () {

    it('registers a new method', function () {
      method.register('create');
      expect(method.methods()[2]).to.contain('create');
    });

  });

});