'use strict';

var Builder = require('./builder');

module.exports = function (ModelBase) {
  var Model = ModelBase.extend();

  Model.authorization = {
    rules: []
  };

  Model.authorize = function (User) {
    return Builder.create(User, this.authorization.rules);
  };

  Model.extend = function () {
    var Extended = ModelBase.extend.apply(Model, arguments);
    Extended.authorization = {
      rules: []
    };
    return Extended;
  };

  return Model;
};