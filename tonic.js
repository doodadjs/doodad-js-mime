"use strict";

const root = require('doodad-js').createRoot( /*bootstrapModules*/ null, /*options*/ { node_env: 'development' } );

const modules = {};
require('doodad-js-mime').add(modules);

root.Doodad.Namespaces.loadNamespaces( function callback() {
	
	const mime = root.Doodad.Tools.Mime;
	console.log( mime.getExtensions('text/plain') );
	
}, /*donThrow*/ false, /*options*/ null, modules )
	['catch'](function(err) {
		console.error(err);
	});