require('mocha-as-promised')();
require('chai')
  .use(require('chai-as-promised'))
  .use(require('sinon-chai'));
var Bluebird = require('bluebird');
Bluebird.longStackTraces();
Bluebird.onPossiblyUnhandledRejection(function(err, promise){
  throw err;
});