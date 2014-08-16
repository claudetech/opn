'use strict';
var path = require('path');
var execFile = require('child_process').execFile;

module.exports = function (target, app, options, cb) {
	if (typeof target !== 'string') {
		throw new Error('Expected a `target`');
	}

	if (typeof app === 'function') {
		cb = app;
		app = null;
		options = {};
	} else if (typeof app === 'object') {
		app = null;
		cb = options;
		options = app;
	}
	if (typeof options === 'function') {
		cb = options;
		options = {};
	}

	var cmd;
	var args = [];

	if (process.platform === 'darwin') {
		cmd = 'open';

		if (cb) {
			args.push('-W');
		}

		if (options.keepFocus) {
			args.push('-g');
		}

		if (app) {
			args.push('-a', app);
		}
	} else if (process.platform === 'win32') {
		cmd = 'cmd';
		args.push('/c', 'start');
		target = target.replace(/&/g, '^&');

		if (cb) {
			args.push('/wait');
		}

		if (app) {
			args.push(app);
		}
	} else {
		if (app) {
			cmd = app;
		} else {
			// http://portland.freedesktop.org/download/xdg-utils-1.1.0-rc1.tar.gz
			cmd = path.join(__dirname, 'xdg-open');
		}
	}

	args.push(target);

	// xdg-open will block the process unless stdio is ignored
	execFile(cmd, args, {stdio: 'ignore'}, cb);
};
