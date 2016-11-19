//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Tools_Mime.js - Mime Tools
// Project home: https://github.com/doodadjs/
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2016 Claude Petit
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

module.exports = {
	add: function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Tools.Mime'] = {
			version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
			create: function create(root, /*optional*/_options, _shared) {
				"use strict";
				
				var doodad = root.Doodad,
					types = doodad.Types,
					tools = doodad.Tools,
					files = tools.Files,
					namespaces = doodad.Namespaces,
					modules = doodad.Modules,
					config = tools.Config,
					mime = tools.Mime;


				var __Internal__ = {
					mimeExtensions: null,
					mimeTypes: null,
				};


				var __options__ = types.extend({
					resourcesPath: './res/', // Combined with package's root folder
				}, _options);

				//__options__. = types.to...(__options__.);

				types.freezeObject(__options__);

				mime.getOptions = function() {
					return __options__;
				};

				// TODO: Make a better and common resources locator and loader
				__Internal__.resourcesLoader = {
					locate: function locate(fileName, /*optional*/options) {
						var Promise = types.getPromise();
						return Promise['try'](function() {
							var path = tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})())
								.set({file: null})
								.combine(_shared.pathParser(__options__.resourcesPath))
								.combine(_shared.pathParser(fileName));
							return path;
						});
					},
					load: function load(path, /*optional*/options) {
						return config.load(path, { async: true, watch: true, encoding: 'utf-8' }, types.get(options, 'callback'));
					},
				},
				
				mime.setResourcesLoader = function setResourcesLoader(loader) {
					__Internal__.resourcesLoader = loader;
				};
				
				
				mime.getTypes = function getTypes(fileName, /*optional*/defaultType) {
					if (types.isNothing(fileName)) {
						return [];
					};
					var pos = fileName.lastIndexOf('.');
					if (pos >= 0) {
						fileName = fileName.slice(pos + 1);
					} else {
						fileName = '';
					};
					if (defaultType && !types.isArray(defaultType)) {
						defaultType = [defaultType];
					};
					return types.get(__Internal__.mimeExtensions, fileName.toLowerCase(), defaultType || ['application/octet-stream']);
				};
				
				mime.getExtensions = function getExtensions(mimeType, /*optional*/defaultExtension) {
					if (types.isNothing(mimeType)) {
						return [];
					};
					if (defaultExtension && !types.isArray(defaultExtension)) {
						defaultExtension = [defaultExtension];
					};
					return types.get(__Internal__.mimeTypes, mimeType.toLowerCase(), defaultExtension || ['']);
				};
				
				mime.getSupportedTypes = function getSupportedTypes() {
					return types.keys(__Internal__.mimeTypes);
				};
				
				mime.getKnownExtensions = function getKnownExtensions() {
					return types.keys(__Internal__.mimeExtensions);
				};
				
				
				__Internal__.parseMimeExtensions = function parseMimeExtensions(err, data) {
		//console.log(data);
					if (!err) {
						__Internal__.mimeExtensions = data.mimeExtensions;
						var mimeTypes = __Internal__.mimeTypes = {};
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
				};
				
				mime.loadTypes = function loadTypes() {
					return __Internal__.resourcesLoader.locate('mimeExtensions.json')
						.then(function(location) {
							return __Internal__.resourcesLoader.load(location, {callback: __Internal__.parseMimeExtensions});
						});
				};

				
				mime.setType = function setType(name, ext) {
					if (root.DD_ASSERT) {
						root.DD_ASSERT(types.isString(name), "Invalid name.");
						root.DD_ASSERT(types.isString(ext) || (types.isArray(ext) && ext.length), "Invalid extension.");
					};
					if (!types.isArray(ext)) {
						ext = [ext];
					};
					var current = types.get(__Internal__.mimeTypes, name);
					if (!current) {
						current = [];
					};
					__Internal__.mimeTypes[name] = current = types.unique(current, ext);
					tools.forEach(ext, function(n) {
						var c = types.get(__Internal__.mimeExtensions, n);
						if (!n) {
							n = [];
						};
						__Internal__.mimeExtensions[n] = types.unique(c, [name]);
					});
				};
				

				return function init(/*optional*/options) {
					return mime.loadTypes();
				};
				
			},
		};
		return DD_MODULES;
	},
};
//! END_MODULE()