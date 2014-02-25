var expect                 = require('chai').expect;
var _                      = require('lodash');
var sinon                  = require('sinon');

var bookshelf              = require('../mocks/bookshelf');
var bookshelfAuthorization = require('../../lib/bookshelf-authorization');

describe('Bookshelf Authorization', function () {
  'use strict';

  beforeEach(function () {
    this.bookshelf = _.clone(bookshelf);
  });

  it('loads the registry plugin', function () {
    this.bookshelf.plugin(bookshelfAuthorization);
    expect(this.bookshelf).to.itself.respondTo('model');
  });

  it('does not overwrite the registry plugin if already loaded', function () {
    var registry = require('bookshelf/plugins/registry');
    this.bookshelf.plugin(registry);
    sinon.spy(this.bookshelf, 'plugin');
    this.bookshelf.plugin(bookshelfAuthorization);
    expect(this.bookshelf.plugin).to.not.have.been.calledWith(registry);
  });

  describe('Bookshelf plugin', function () {

    beforeEach(function () {
      this.bookshelf.plugin(bookshelfAuthorization);
    });

    it('sets the UserBase on the Bookshelf instance', function () {
      expect(this.bookshelf)
        .to.have.property('User')
        .with.property('can');
    });

    it('overwrites Bookshelf.Model', function () {
      expect(this.bookshelf)
        .to.have.property('Model')
        .with.property('authorize');
    });

  });

  describe('Custom configuration', function () {

    var Bases;
    beforeEach(function () {
      Bases = bookshelfAuthorization(this.bookshelf, this.bookshelf.Model);
    });

    it('returns the ModelBase', function () {
      expect(Bases)
        .to.have.property('Model')
        .with.property('authorize');
    });

    it('returns the UserBase', function () {
      expect(Bases)
        .to.have.property('User')
        .with.property('can');
    });

  });

});