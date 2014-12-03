# bower-directory

[![Build Status](https://travis-ci.org/shinnn/bower-directory.svg?branch=master)](https://travis-ci.org/shinnn/bower-directory)
[![Build status](https://ci.appveyor.com/api/projects/status/dxdbd19qc0ei2738)](https://ci.appveyor.com/project/ShinnosukeWatanabe/bower-directory)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/bower-directory.svg)](https://coveralls.io/r/shinnn/bower-directory)
[![Dependency Status](https://david-dm.org/shinnn/bower-directory.svg)](https://david-dm.org/shinnn/bower-directory)
[![devDependency Status](https://david-dm.org/shinnn/bower-directory/dev-status.svg)](https://david-dm.org/shinnn/bower-directory#info=devDependencies)

A [Node](http://nodejs.org/) module to detect the path where [bower](http://bower.io/) components should be saved

```javascript
var bowerDirectory = require('bower-directory');

bowerDirectory(function(err, result) {
  if (err) {
    throw err;
  }

  console.log('Bower directory: ' + result);
  // yields: "Bower directory: /path/to/your/project/bower_components"
}); 
```

## Installation

[![NPM version](https://badge.fury.io/js/bower-directory.svg)](http://badge.fury.io/js/bower-directory)

[Use npm.](https://www.npmjs.org/doc/cli/npm-install.html)

```sh
npm install --save bower-directory
```

## API

```javascript
var bowerDirectory = require('bower-directory');
```

### bowerDirectory([option, ]callback)

#### option

Type: `Object`  
Default: `{}`

##### option.cwd

Type: `String` (relative or absolute file path)  
Default: current directory

This function searches this path for [`.bowerrc`](http://bower.io/docs/config/).

#### callback(error, path)

##### error

`null` (by default), or a [syntax error](http://www.ecma-international.org/ecma-262/5.1/#sec-15.11.6.4) if `.bowerrc` exists but isn't a valid JSON.

##### path

The absolute path where bower components should be saved. It depends on the [`cwd` property](http://bower.io/docs/config/#cwd) and [`directory` property](http://bower.io/docs/config/#directory) of `.bowerrc`. If this function cannot find `.bowerrc`, it uses the default value (`{"directory": "bower_components"}`).

```javascript
// /path/to/your/project/foo/.bowerrc: {"cwd": "bar", "directory": "baz"}

bowerDirectory({cwd: 'foo'}, function(err, dir) {
  if (err) {
    throw err;
  }
  console.log(dir);
  // yields: "/path/to/your/project/foo/bar/baz"
});
```

### bowerDirectory.sync(option)

Return: `String` (absolute file path) 

Synchronous version of [`bowerDirectory()`](#bowerdirectoryoption-callback).

## CLI

You can use this module as a CLI tool by installing it [globally](https://www.npmjs.org/doc/files/npm-folders.html#global-installation).

```sh
npm install -g bower-direcory
```

### Usage

```sh
bower-directory
> /path/to/current/directory/bower_components

bower-directory --help
> bower-directory:
>   Detect the path where bower components should be saved

bower-directory --version
> 0.1.0
```

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
