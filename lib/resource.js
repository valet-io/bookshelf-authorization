module.exports = function (ModelBase) {
  'use strict';  
  return ModelBase.extend({
    authorization: {
      all: true,
      read: true,
      write: true
    }
  });
};