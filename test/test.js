'use strict';

var assert = require('assert');
var exec = require('child_process').exec;
var path = require('path');

var pkg = require('load-pkg');

var bowerDirectory = require('require-main')();
var bowerDirectoryBin = 'node ' + path.resolve(pkg.bin);

var baseDir = path.resolve('test/fixtures');

beforeEach(() => process.chdir(baseDir));

var specs = [
  {
    message: 'should specify "bower_components" path when .bowerrc is not found.',
    chdir: 'no_bowerrc',
    expected: 'no_bowerrc/bower_components'
  },
  {
    message: 'should specify a path according to the cwd property of .bowerrc.',
    chdir: 'includes_bowerrc/cwd',
    expected: 'bower_components'
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

describe('bowerDirectory()', () => {
  specs.forEach(spec => {
    it(spec.message, done => {
      if (spec.chdir) {
        process.chdir(spec.chdir);
      }
      bowerDirectory(spec.option, (err, dir) => {
        if (err) {
          done(err);
          return;
        }
        assert.strictEqual(dir, path.resolve(baseDir, spec.expected));
        done();
      });
    });
  });

  it('should pass a syntax error when .bowerrc is not a valid JSON.', done => {
    process.chdir('invalid_bowerrc');
    bowerDirectory(err => {
      assert.throws(() => assert.ifError(err), SyntaxError);
      done();
    });
  });
});

describe('bowerDirectory.sync()', () => {
  specs.forEach(spec => {
    it(spec.message, () => {
      if (spec.chdir) {
        process.chdir(spec.chdir);
      }
      assert.strictEqual(
        bowerDirectory.sync(spec.option),
        path.resolve(baseDir, spec.expected)
      );
    });
  });

  it('should throw a syntax error when .bowerrc is not a valid JSON.', () => {
    process.chdir(path.join(baseDir, 'invalid_bowerrc'));
    assert.throws(bowerDirectory.sync, SyntaxError);
  });
});

describe('"bower-directory" command', () => {
  specs.slice(0, 3).forEach(spec => {
    it(spec.message, done => {
      exec(bowerDirectoryBin, {cwd: spec.chdir}, (err, stdout) => {
        if (err) {
          done(err);
          return;
        }
        assert.strictEqual(
          stdout.toString(),
          path.resolve(baseDir, spec.expected + '\n')
        );
        done();
      });
    });
  });

  it('should fail when .bowerrc is not a valid JSON.', done => {
    exec(bowerDirectoryBin, {cwd: 'invalid_bowerrc'}, err => {
      assert.throws(() => assert.ifError(err));
      done();
    });
  });

  it('should print the introduction if `--help` flag enabled.', done => {
    exec(bowerDirectoryBin + ' --help', (err, stdout) => {
      if (err) {
        done(err);
        return;
      }
      assert(/bower-directory:/.test(stdout));
      done();
    });
  });

  it('should print the version if `--version` flag enabled.', done => {
    exec(bowerDirectoryBin + ' --version', (err, stdout) => {
      if (err) {
        done(err);
        return;
      }
      assert.strictEqual(stdout, pkg.version + '\n');
      done();
    });
  });
});
