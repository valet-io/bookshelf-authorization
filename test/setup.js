require('mocha-as-promised')();
require('chai')
  .use(require('chai-as-promised'))
  .use(require('sinon-chai'));
require('bluebird').longStackTraces()