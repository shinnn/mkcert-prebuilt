'use strict';

var assert = require('assert');
var exec = require('child_process').exec;
var path = require('path');

var bowerDirectory = require('../');
var eachExec = require('each-exec');

var pkg = require('../package.json');
var bowerDirectoryBin = 'node ' + path.resolve(pkg.bin);

var baseDir = path.resolve('test/fixtures');

beforeEach(function() {
  process.chdir(baseDir);
});

var specs = [
  {
    message: 'should specify "bower_components" path when .bowerrc is not found.',
    chdir: 'no_bowerrc',
    expected: 'no_bowerrc/bower_components'
  },
  {
    message: 'should specify a path according to the cwd property of .bowerrc.',
    chdir: 'includes_bowerrc/cwd',
    expected: 'includes_bowerrc/cwd/bower_components'
  },
  {
    message: 'should specify a path according to the directory property of .bowerrc.',
    chdir: 'includes_bowerrc/directory',
    expected: 'includes_bowerrc/directory/foo/bar'
  },
  {
    message: 'should specify a path according to cwd option.',
    option: {cwd: 'no_bowerrc'},
    expected: 'no_bowerrc/bower_components'
  },
  {
    message: 'should specify a path according to cwd option and .bowerrc.',
    option: {cwd: 'includes_bowerrc/directory'},
    expected: 'includes_bowerrc/directory/foo/bar'
  }
];

describe('bowerDirectory()', function() {
  specs.forEach(function(spec) {
    it(spec.message, function(done) {
      if (spec.chdir) {
        process.chdir(spec.chdir);
      }
      bowerDirectory(spec.option, function(err, dir) {
        if (!err) {
          assert.equal(dir, path.resolve(baseDir, spec.expected));
        }
        done(err);
      });
    });

    it('should pass an error when parsing .bowerrc fails.', function(done) {
      process.chdir('invalid_bowerrc');
      bowerDirectory(function(err) {
        assert(err);
        assert.equal(err.name, 'Error');
        assert.equal(arguments.length, 2);
        done();
      });
    });
  });
});

describe('bowerDirectory.sync()', function() {
  specs.forEach(function(spec) {
    it(spec.message, function() {
      if (spec.chdir) {
        process.chdir(spec.chdir);
      }
      assert.strictEqual(
        bowerDirectory.sync(spec.option),
        path.resolve(baseDir, spec.expected)
      );
    });
  });

  it('should throw a syntax error when .bowerrc is not a valid JSON.', function() {
    process.chdir(path.join(baseDir, 'invalid_bowerrc'));
    assert.throws(bowerDirectory.sync, Error);
  });

  it('should fail when a .bowerrc directory is found.', function() {
    process.chdir(path.join(baseDir, 'invalid_directory_bowerrc'));
    assert.throws(bowerDirectory.sync, Error);
  });
});

describe('"bower-directory" command', function() {
  specs.slice(0, 3).forEach(function(spec) {
    it(spec.message, function(done) {
      exec(bowerDirectoryBin, {
        cwd: spec.chdir || spec.option.cwd
      }, function(err, stdout, stderr) {
        if (!err) {
          assert.equal(stdout, path.resolve(baseDir, spec.expected + '\n'));
          assert.equal(stderr, '');
        }
        done();
      });
    });
  });

  it('should fail when .bowerrc is not a valid JSON.', function(done) {
    exec(bowerDirectoryBin, {cwd: 'invalid_bowerrc'}, function(err, stdout, stderr) {
      assert(err);
      assert.equal(stdout, '');
      assert(/Error/.test(stderr));
      done();
    });
  });

  it('should print usage information using `--help` or `-h` flag.', function(done) {
    eachExec([
      bowerDirectoryBin + ' --help',
      bowerDirectoryBin + ' --h'
    ], function(err, stdouts, stderrs) {
      if (!err) {
        assert(/bower-directory:/.test(stdouts[0]));
        assert.equal(stdouts[0], stdouts[1]);
        assert.equal(stderrs[0], '');
        assert.equal(stderrs[0], stderrs[1]);
      }
      done(err);
    });
  });

  it('should print version number using `--version` or `-v` flag.', function(done) {
    eachExec([
      bowerDirectoryBin + ' --version',
      bowerDirectoryBin + ' --v'
    ], function(err, stdouts, stderrs) {
      if (!err) {
        assert.equal(stdouts[0], pkg.version + '\n');
        assert.equal(stdouts[0], stdouts[1]);
        assert.equal(stderrs[0], '');
        assert.equal(stderrs[0], stderrs[1]);
      }
      done(err);
    });
  });
});
