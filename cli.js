#!/usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'version',
    h: 'help'
  },
  boolean: ['version', 'help']
});

if (argv.version) {
  console.log(require('./package.json').version);
} else if (argv.help) {
  console.log(
    'bower-directory:\n' +
    '  Detect the path where bower components should be saved'
  );
} else {
  var bowerDirectory = require('./');
  console.log(bowerDirectory.sync());
}
