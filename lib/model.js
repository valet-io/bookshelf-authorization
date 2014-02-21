module.exports = function (ModelBase) {
  'use strict';
  var Model = ModelBase.extend({
    authorization: {
      all: true,
      read: true,
      write: true
    }
  });

  Object.defineProperty(Model, 'authorize', {
    get: function () {
      return {};
    }
  });

  return Model;
};