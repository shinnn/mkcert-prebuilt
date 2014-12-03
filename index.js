'use strict';

var path = require('path');

var isFileSync = require('is-file').sync;
var readJson = require('read-json');
var readJsonSync = require('read-json-sync');

function getBowerDir(json) {
  return path.join(json.cwd || '', json.directory || 'bower_components');
}

module.exports = function bowerDirectory(option, cb) {
  if (cb === undefined) {
    cb = option;
  }
  option = option || {};
  var resolveFromCwd = path.resolve.bind(path, option.cwd || '');

  readJson(resolveFromCwd('.bowerrc'), function(err, data) {
    var bowerDirRelative;

    if (!err) {
      bowerDirRelative = getBowerDir(data);
    } else {
      if (err.name === 'SyntaxError') {
        cb(err);
        return;
      }

      bowerDirRelative = 'bower_components';
    }
    cb(null, resolveFromCwd(bowerDirRelative));
  });
};

module.exports.sync = function bowerDirectorySync(option) {
  option = option || {};
  var resolveFromCwd = path.resolve.bind(path, option.cwd || '');

  var bowerrcPath = resolveFromCwd('.bowerrc');

  if (isFileSync(bowerrcPath)) {
    return resolveFromCwd(getBowerDir(readJsonSync(bowerrcPath)));
  } else {
    return resolveFromCwd('bower_components');
  }
};
