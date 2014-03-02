'use strict';

var expect                 = require('chai').expect;
var sinon                  = require('sinon');
var _                      = require('lodash');
var Bookshelf              = require('../mocks/bookshelf');
var bookshelfAuthorization = require('../../lib/bookshelf-authorization');
var registry               = require('bookshelf/plugins/registry');
var resolver               = require('../../lib/resolver');

describe('Bookshelf Authorization', function () {

  describe('Default', function () {

    beforeEach(function () {
      Bookshelf.plugin(bookshelfAuthorization);
    });

    it('sets the UserBase on the Bookshelf instance', function () {
      expect(Bookshelf.User).to.have.property('can');
    });

    it('overwrites Bookshelf.Model', function () {
      expect(Bookshelf.Model).to.have.property('authorize');
    });

  });

  describe('Registry', function () {

    it('appends the registry methods to the resolver if loaded', function () {
      Bookshelf.plugin(registry);
      Bookshelf.plugin(bookshelfAuthorization);
      expect(resolver).to.itself.respondTo('model');
      expect(resolver).to.itself.respondTo('collection');
    });

  });

  describe('Custom ModelBase', function () {

    var base;
    beforeEach(function () {
      base = {
        Model: Bookshelf.Model.extend()
      };
      bookshelfAuthorization(Bookshelf, {
        base: base
      });
    });

    it('sets the UserBase on the base object', function () {
      expect(base.User).to.have.property('can');
    });

    it('configures the custom base model', function () {
      expect(base.Model).to.have.property('authorize');
    });

  });

});