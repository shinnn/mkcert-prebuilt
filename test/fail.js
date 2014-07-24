'use strict';

const nock = require('nock');

nock('https://github.com').get(/.*/u).reply(451);
require('../install.js');
