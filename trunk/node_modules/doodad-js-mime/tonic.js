"use strict";

const root = require('doodad-js').createRoot();

const modules = {};
require('doodad-js-mime').add(modules);

function startup() {
	const mime = root.Doodad.Tools.Mime;
	console.log( mime.getExtensions('text/plain') );
};

root.Doodad.Namespaces.load( modules, startup )
	['catch'](function(err) {
		console.error(err);
	});