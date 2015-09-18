'use strict';

var path = require('path');
var bowerConfig = require('bower/lib/config');

function bowerDirectorySync(option) {
  option = option || {};

  option.cwd = option.cwd || process.cwd();

  return path.resolve(option.cwd, bowerConfig(option).directory);
}

function bowerDirectory(option, cb) {
  var p;
  var err;

  if (cb === undefined) {
    cb = option;
  }

  try {
    p = bowerDirectorySync(option);
  } catch (e) {
    err = e;
  } finally {
    cb(err, p);
  }
}

module.exports = bowerDirectory;
module.exports.sync = bowerDirectorySync;
