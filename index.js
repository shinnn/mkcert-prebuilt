'use strict';

var fs = require('fs');
var path = require('path');

var isFileSync = require('is-file').sync;
var xtend = require('xtend');

var stripBOM = str => str.replace(/^\uFEFF/g, '');

var parseBowerrc = str => {
  return xtend({
    cwd: '',
    directory: 'bower_components'
  }, JSON.parse(stripBOM(str)));
};

var joinCwdDir = bowerrc => path.join(bowerrc.cwd, bowerrc.directory);

module.exports = function bowerDirectory(_opts, _cb) {
  var option = xtend({cwd: ''}, _opts || {});
  var callback = _cb || _opts;

  fs.readFile(path.resolve(option.cwd, '.bowerrc'), (readErr, buf) => {
    if (readErr) {
      callback(null, path.resolve(option.cwd, 'bower_components'));
      return;
    }
    
    try {
      var bowerrc = parseBowerrc(buf.toString());
      callback(null, path.resolve(option.cwd, joinCwdDir(bowerrc)));
    } catch (parseErr) {
      callback(parseErr);
    }
  });
};

module.exports.sync = function bowerDirectorySync(_opts = {}) {
  var option = xtend({cwd: ''}, _opts);
  var bowerrcPath = path.resolve(option.cwd, '.bowerrc');

  if (isFileSync(bowerrcPath)) {
    var bowerrc = parseBowerrc(fs.readFileSync(bowerrcPath).toString());
    return path.resolve(option.cwd, joinCwdDir(bowerrc));
  } else {
    return path.resolve(option.cwd, 'bower_components');
  }
};
