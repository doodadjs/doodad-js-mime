"doodad-js" Mime (beta).

[![NPM Version][npm-image]][npm-url]
 
<<<< PLEASE UPGRADE TO THE LATEST VERSION AS OFTEN AS POSSIBLE >>>>

## Installation

```bash
$ npm install doodad-js-mime
```

## Features

  -  Resolves file extensions to mime types.
  -  Resolves mime types to file extensions.

NOTE: I'm waiting a database from IANA. Thanks to them for listening me.

## Quick Start

```js
    "use strict";

    const modules = {};
	require('doodad-js-mime').add(modules);

    require('doodad-js').createRoot(modules).then(root => {
			const mime = root.Doodad.Tools.Mime;
			console.log(mime.getTypes('index.html'));
			console.log(mime.getExtensions('text/plain'));
		}).catch(err => {
            console.error(err);
        });
```

## Example

```js
	"use strict";

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
```

## Other available packages

  - **doodad-js**: Object-oriented programming framework (release)
  - **doodad-js-cluster**: Cluster manager (alpha)
  - **doodad-js-dates**: Dates formatting (beta)
  - **doodad-js-http**: Http server (alpha)
  - **doodad-js-http_jsonrpc**: JSON-RPC over http server (alpha)
  - **doodad-js-io**: I/O module (alpha)
  - **doodad-js-ipc**: IPC/RPC server (alpha)
  - **doodad-js-json**: JSON parser (alpha)
  - **doodad-js-loader**: Scripts loader (beta)
  - **doodad-js-locale**: Locales (beta)
  - **doodad-js-make**: Make tools for doodad (alpha)
  - **doodad-js-mime**: Mime types (beta)
  - **doodad-js-minifiers**: Javascript minifier used by doodad (alpha)
  - **doodad-js-safeeval**: SafeEval (beta)
  - **doodad-js-server**: Servers base module (alpha)
  - **doodad-js-templates**: HTML page templates (alpha)
  - **doodad-js-terminal**: Terminal (alpha)
  - **doodad-js-test**: Test application
  - **doodad-js-unicode**: Unicode Tools (beta)
  - **doodad-js-widgets**: Widgets base module (alpha)
  - **doodad-js-xml**: XML Parser (beta)
  
## License

  [Apache-2.0][license-url]

[npm-image]: https://img.shields.io/npm/v/doodad-js-mime.svg
[npm-url]: https://npmjs.org/package/doodad-js-mime
[license-url]: http://opensource.org/licenses/Apache-2.0