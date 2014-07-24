# mkcert-prebuilt

[![npm version](https://img.shields.io/npm/v/mkcert-prebuilt.svg)](https://www.npmjs.com/package/mkcert-prebuilt)
[![Build Status](https://travis-ci.com/shinnn/mkcert-prebuilt.svg?branch=master)](https://travis-ci.com/shinnn/mkcert-prebuilt)
[![codecov](https://codecov.io/gh/shinnn/mkcert-prebuilt/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/mkcert-prebuilt)

An [npm package](https://docs.npmjs.com/about-packages-and-modules#about-packages) to install a [mkcert](https://github.com/FiloSottile/mkcert) prebuilt binary

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install mkcert-prebuilt
```

As this package makes use of `install` [npm script](https://docs.npmjs.com/misc/scripts) in order to download a binary for the current platform, [`ignore-scripts` npm-config](https://docs.npmjs.com/misc/config#ignore-scripts) cannot be enabled while executing the command above.

## API

### `require('mkcert-prebuilt')`

Type: `string`

An absolute path to the installed mkcert binary, which can be used with [`child_process`](https://nodejs.org/api/child_process.html) functions.

```javascript
const {spawn} = require('child_process');
const mkcert = require('mkcert-prebuilt');

spawn(mkcert, ['-install']);
```

## CLI

Once this package is installed to the project directory, users can execute `mkcert` command inside [npm scripts](https://docs.npmjs.com/misc/scripts#description) of the project.

```json
"create-cert": "mkcert example.org localhost 127.0.0.1 ::1"
```

```console
$ npm run-script create-cert
```

## License

[ISC License](./LICENSE.md) © 2019 Shinnosuke Watanabe

### mkcert

[BSD 3-Clause "New" or "Revised" License](./LICENSE.md#mkcert) © 2018 The mkcert Authors
