'use strict';

var expect                 = require('chai').expect;
var sinon                  = require('sinon');

var bookshelf              = require('../mocks/bookshelf');
var bookshelfAuthorization = require('../../lib/bookshelf-authorization');

describe('Bookshelf Authorization', function () {

  before(function () {
    bookshelf.plugin(bookshelfAuthorization);
  });

  it('sets the UserBase on the Bookshelf instance', function () {
    expect(bookshelf)
      .to.have.property('User')
      .with.property('can');
  });

  it('overwrites Bookshelf.Model', function () {
    expect(bookshelf)
      .to.have.property('Model')
      .with.property('authorize');
  });

});