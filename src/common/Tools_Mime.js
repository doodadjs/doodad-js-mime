//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Tools_Mime.js - Mime Tools
// Project home: https://github.com/doodadjs/
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2015-2018 Claude Petit
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//		http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//! END_REPLACE()

//! IF_SET("mjs")
//! ELSE()
"use strict";
//! END_IF()

exports.add = function add(modules) {
	modules = (modules || {});
	modules['Doodad.Tools.Mime'] = {
		version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
		dependencies: [
			{
				name: 'Doodad.Tools.Mime/Resources',
				optional: true,
			},
		],
		create: function create(root, /*optional*/_options, _shared) {
			const doodad = root.Doodad,
				types = doodad.Types,
				tools = doodad.Tools,
				files = tools.Files,
				//namespaces = doodad.Namespaces,
				modules = doodad.Modules,
				resources = doodad.Resources,
				//config = tools.Config,
				mime = tools.Mime;


			const __Internal__ = {
				mimeExtensions: null,
				mimeTypes: null,
			};


			mime.ADD('getTypes', function getTypes(fileName) {
				if (types.isNothing(fileName)) {
					return [];
				};
				if (types._instanceof(fileName, [files.Url, files.Path])) {
					fileName = fileName.file || '';
				};
				// NOTE: Mime types are not having extensions like ".min.js". Only ".js" is taken.
				const pos = fileName.lastIndexOf('.');
				if (pos >= 0) {
					fileName = fileName.slice(pos + 1);
				} else {
					fileName = '';
				};
				return types.get(__Internal__.mimeExtensions, fileName.toLowerCase());
			});

			mime.ADD('getExtensions', function getExtensions(mimeType) {
				if (types.isNothing(mimeType)) {
					return [];
				};
				return types.get(__Internal__.mimeTypes, mimeType.toLowerCase());
			});

			mime.ADD('getSupportedTypes', function getSupportedTypes() {
				return types.keys(__Internal__.mimeTypes);
			});

			mime.ADD('getKnownExtensions', function getKnownExtensions() {
				return types.keys(__Internal__.mimeExtensions);
			});


			__Internal__.parseMimeExtensions = function parseMimeExtensions(data) {
				//console.log(data);
				__Internal__.mimeExtensions = data.mimeExtensions;
				const mimeTypes = __Internal__.mimeTypes = {};
				tools.forEach(data.mimeExtensions, function(mTypes, extension) {
					tools.forEach(mTypes, function(mType) {
						if (types.has(mimeTypes, mType)) {
							mimeTypes[mType].push(extension);
						} else {
							mimeTypes[mType] = [extension];
						};
					});
				});
			};

			mime.ADD('loadTypes', function loadTypes() {
				const loader = mime.getResourcesLoader();
				return loader.load('./common/res/mimeExtensions.json')
					.then(__Internal__.parseMimeExtensions);
			});


			mime.ADD('setType', function setType(name, ext) {
				if (root.DD_ASSERT) {
					root.DD_ASSERT(types.isString(name), "Invalid name.");
					root.DD_ASSERT(types.isString(ext) || types.isArray(ext), "Invalid extension.");
				};
				if (!types.isArray(ext)) {
					ext = [ext];
				};
				let current = types.get(__Internal__.mimeTypes, name);
				if (!current) {
					current = [];
				};
				__Internal__.mimeTypes[name] = current = tools.unique(current, ext);
				tools.forEach(ext, function(n) {
					let c = types.get(__Internal__.mimeExtensions, n);
					if (!c) {
						c = [];
					};
					__Internal__.mimeExtensions[n] = tools.unique(c, [name]);
				});
			});


			return function init(options) {
				const Promise = types.getPromise();
				return Promise.resolve(root.serverSide ? files.Path.parse(module.filename) : modules.locate(/*! INJECT(TO_SOURCE(MANIFEST('name'))) */))
					.then(function(location) {
						location = location.set({file: ''});
						resources.createResourcesLoader(mime, (root.serverSide ? location.moveUp(1) : location));

						return mime.loadTypes();
					});
			};
		},
	};
	return modules;
};

//! END_MODULE()
