'use strict';

const {dirname, join} = require('path');
const {execFile} = require('child_process');
const {lstat} = require('fs');
const {promisify} = require('util');
const {randomBytes} = require('crypto');

const test = require('tape');
const mkcert = require('..');
const {bin} = require('../package.json');

const promisifiedExecFile = promisify(execFile);
const promisifiedRandomBytes = promisify(randomBytes);

const projectDir = dirname(__dirname);
const shell = process.platform === 'win32';

test('`bin` field of package.json', t => {
	t.deepEqual(
		Object.keys(bin),
		['mkcert'],
		'should only include a single path.'
	);

	t.end();
});

test('Node.js API', t => {
	t.equal(
		typeof mkcert,
		'string',
		'should expose a string.'
	);

	t.equal(
		mkcert,
		join(projectDir, bin.mkcert),
		'should be equal to the binary path.'
	);

	t.end();
});

test('`prepublishOnly` npm script', async t => {
	await promisifiedExecFile('npm', ['run-script', 'prepublishOnly'], {shell});

	const stat = await promisify(lstat)(mkcert);

	t.ok(
		stat.isFile(),
		'should create a placeholder file.'
	);

	t.ok(
		stat.size < 250,
		'should create a sufficiently small file.'
	);

	t.end();
});

test('`install` npm script', async t => {
	await Promise.all([
		(async () => {
			await promisifiedExecFile('npm', ['run-script', 'install'], {shell});
			try {
				await promisifiedExecFile(mkcert, ['--help'], {timeout: 5000});
				t.fail('Unexpectedly succeeded.');
			} catch ({stderr}) {
				t.ok(
					stderr.includes('Use -cert-file, -key-file and -p12-file to customize the output paths.'),
					'should install a mkcert binary.'
				);
			}
		})(),
		(async () => {
			try {
				await promisifiedExecFile('npm', ['run-script', 'install'], {
					shell,
					env: {
						...process.env,
						npm_config_http_proxy: `https://io45rkkl${await promisifiedRandomBytes(8).toString('hex')}.org`
					}
				});
				t.fail('Unexpectedly succeeded.');
			} catch ({message}) {
				t.ok(
					message.includes('tunneling socket could not be established'),
					'should respect `http-proxy` config.'
				);
			}
		})(),
		(async () => {
			try {
				await promisifiedExecFile('npm', ['run-script', 'install'], {
					shell,
					env: {
						...process.env,
						npm_config_https_proxy: 'https://io45fgl{await promisifiedRandomBytes(8).toString(\'hex\')}.org'
					}
				});
				t.fail('Unexpectedly succeeded.');
			} catch ({message}) {
				t.ok(
					message.includes('tunneling socket could not be established'),
					'should respect `https-proxy` npm config.'
				);
			}
		})(),
		...!process.env.TRAVIS_OS_NAME || process.env.TRAVIS_OS_NAME === 'linux' ? [
			(async () => {
				try {
					await promisifiedExecFile('docker', [
						'run',
						`--volume=${projectDir}:${projectDir}`,
						`--workdir=${projectDir}`,
						...process.env.CI ? ['--env', 'CI=true'] : [],
						'i386/node:11-alpine',
						'npx',
						'nyc',
						'--no-clean',
						'npm',
						'run-script',
						'install'
					], {shell});
					t.fail('Unexpectedly succeeded.');
				} catch ({message}) {
					t.ok(
						message.includes('mkcert doesn\'t support 32 bit architecture.'),
						'should fail when the architecture is 32 bit.'
					);
				}
			})()
		] : [],
		(async () => {
			try {
				await promisifiedExecFile(process.argv[0], [require.resolve('./fail.js')]);
				t.fail('Unexpectedly succeeded.');
			} catch ({stderr}) {
				t.ok(
					stderr.match(/Failed to download an archive from https:.*1\.2\.0.*\(451/u),
					'should fail when it cannot download a binary.'
				);
			}
		})(),
		(async () => {
			try {
				await promisifiedExecFile(process.argv[0], [require.resolve('./unsupported.js')], {shell});
				t.fail('Unexpectedly succeeded.');
			} catch ({stderr}) {
				t.equal(
					stderr,
					'Prebuilt mkcert binaries are only provided for Linux, macOS and Windows, not for FreeBSD.\n',
					'should fail when the current platform is not supported.'
				);
			}
		})()
	]);

	t.end();
});
