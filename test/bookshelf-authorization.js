var expect                 = require('chai').expect;
var _                      = require('lodash');

var bookshelf              = require('./mocks/bookshelf');
var BookshelfAuthorization = require('../lib/bookshelf-authorization');

describe('Bookshelf Authorization', function () {
  'use strict';

  describe('Bookshelf plugin', function () {

    beforeEach(function () {
      this.bookshelf = _.clone(bookshelf).plugin(BookshelfAuthorization);
    });

    it('sets the UserBase on the Bookshelf instance', function () {
      expect(this.bookshelf)
        .to.have.property('User')
        .and.itself.respondTo('extend');
    });

    it('sets the ResourceBase on the Bookshelf instance', function () {
      expect(this.bookshelf)
        .to.have.property('Resource')
        .and.itself.respondTo('extend');
    });

  });

  describe('Custom configuration', function () {

    var Bases;
    beforeEach(function () {
      this.bookshelf = _.clone(bookshelf);
      Bases = BookshelfAuthorization(this.bookshelf, this.bookshelf.Model);
    });

    it('returns the UserBase', function () {
      expect(Bases)
        .to.have.property('User')
        .and.itself.respondTo('extend');
    });

    it('returns the ResourceBase', function () {
      expect(Bases)
        .to.have.property('Resource')
        .and.itself.respondTo('extend');
    });

  });

});