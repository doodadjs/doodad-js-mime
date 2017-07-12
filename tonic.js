require('doodad-js').createRoot()
	.then(root => {
		return root.Doodad.Modules.load([
			{
				module: 'doodad-js-mime'
			}
		]);
	})
	.then(root => {
		const mime = root.Doodad.Tools.Mime;
		return mime.getExtensions('text/plain');
	}).then(exts => {
		console.log(exts);
	}).catch(err => {
		console.error(err);
	});