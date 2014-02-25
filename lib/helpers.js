'use strict';

exports.isModel = function (input) {
  return input && typeof input.save === 'function';
};

exports.isCtor = function (input) {
  return input && typeof input.extend === 'function';
};