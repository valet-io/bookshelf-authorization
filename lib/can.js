'use strict';

var Promise  = require('bluebird');
var resolver = require('./resolver');

var Can = function (user) {
  this._user = user;
};

Can.prototype.do = function (method, target) {
  var rules = resolver.resolve(this._user, method, target);
  Promise.map(rules, function (rule) {
    return rule.run();
  })
  .all()
  .return(null);
};

module.exports = Can;