#!/usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2));
var bowerDirectorySync = require('<%= main %>').sync;

if (argv.version || argv.v) {
	console.log(require('../package.json').version);
	return;
}

if (argv.help || argv.h) {
	console.log('bower-directory:\n  Detect the path where bower components should be saved');
	return;
}

console.log(bowerDirectorySync());
