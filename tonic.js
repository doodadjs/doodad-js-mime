"use strict";

const modules = {};
require('doodad-js-mime').add(modules);

require('doodad-js').createRoot(modules)
	.then(root => {
		const mime = root.Doodad.Tools.Mime;
		console.log( mime.getExtensions('text/plain') );
	})
	.catch(err => {
		console.error(err);
	});