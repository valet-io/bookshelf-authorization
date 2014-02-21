var _          = require('lodash');

var methods = ['all', ['read', 'write'], []];

var method = function (name, value) {
  if (!_(methods).flatten().contains(name)) {
    throw new Error(name + ' is not a valid method');
  }
};

method.methods = function () {
  return methods;
};

method.register = function (name) {
  methods[2].push(name);
};

module.exports = method;