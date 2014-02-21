module.exports = function (ModelBase) {
  'use strict';  
  return ModelBase.extend({
    authorization: {
      read: true,
      write: true
    }
  });
};