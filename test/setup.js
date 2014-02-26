require('mocha-as-promised')();
require('chai')
  .use(require('chai-as-promised'))
  .use(require('sinon-chai'))
  .use(require('chai-things'));
require('bluebird').longStackTraces();