//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework
// File: Tools_Mime.js - Mime Tools
// Project home: https://sourceforge.net/projects/doodad-js/
// Trunk: svn checkout svn://svn.code.sf.net/p/doodad-js/code/trunk doodad-js-code
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

(function() {
	var global = this;

	var exports = {};
	if (typeof process === 'object') {
		module.exports = exports;
	};
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Tools.Mime'] = {
			type: null,
			version: '0.2.0b',
			namespaces: null,
			dependencies: ['Doodad.Tools', 'Doodad.Tools.Files', 'Doodad.Types', 'Doodad.Namespaces', 'Doodad.Modules'],
			
			create: function create(root, /*optional*/_options) {
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


				__Internal__.oldSetOptions = mime.setOptions;
				mime.setOptions = function setOptions(/*paramarray*/) {
					var options = __Internal__.oldSetOptions.apply(this, arguments),
						settings = types.getDefault(options, 'settings', {});
						
					settings.enableDomObjectsModel = types.toBoolean(types.get(settings, 'enableDomObjectsModel'));
					settings.defaultScriptTimeout = parseInt(types.get(settings, 'defaultScriptTimeout'));
				};
				
				mime.setOptions({
					settings: {
						resourcesPath: './res/', // Combined with package's root folder
					},
					hooks: {
						// TODO: Make a better and common resources locator and loader
						resourcesLoader: {
							locate: function locate(fileName, /*optional*/options) {
								return modules.locate('doodad-js-mime')
									.then(function(location) {
										return location.set({file: null}).combine(files.getOptions().hooks.pathParser(mime.getOptions().settings.resourcesPath)).combine(files.getOptions().hooks.pathParser(fileName));
									});
							},
							load: function load(path, /*optional*/options) {
								return config.loadFile(path, { async: true, watch: true, encoding: 'utf8' }, types.get(options, 'callback'));
							},
						},
					},
				}, _options);
					
				if (global.process && root.getOptions().settings.fromSource) {
					mime.setOptions({
						settings: {
							resourcesPath: './src/common/res/',
						},
					});
				};
				

					
				mime.getTypes = function(fileName, /*optional*/defaultType) {
					if (types.isNothing(fileName)) {
						return [];
					};
					var pos = fileName.lastIndexOf('.');
					if (pos >= 0) {
						fileName = fileName.slice(pos + 1);
					};
					if (defaultType && !types.isArray(defaultType)) {
						defaultType = [defaultType];
					};
					return types.get(__Internal__.mimeExtensions, fileName.toLowerCase(), defaultType || ['application/octet-stream']);
				};
				
				mime.getExtensions = function(mimeType, /*optional*/defaultExtension) {
					if (types.isNothing(mimeType)) {
						return [];
					};
					if (defaultExtension && !types.isArray(defaultExtension)) {
						defaultExtension = [defaultExtension];
					};
					return types.get(__Internal__.mimeTypes, mimeType.toLowerCase(), defaultExtension || ['']);
				};
				
				mime.getSupportedTypes = function() {
					return types.keys(__Internal__.mimeTypes);
				};
				
				mime.getKnownExtensions = function() {
					return types.keys(__Internal__.mimeExtensions);
				};
				
				
				__Internal__.parseMimeExtensions = function parseMimeExtensions(err, data) {
		//console.log(data);
					if (!err) {
						__Internal__.mimeExtensions = data.mimeExtensions;
						var mimeTypes = __Internal__.mimeTypes = {};
						tools.forEach(data.mimeExtensions, function(mTypes, extension) {
							tools.forEach(mTypes, function(mType) {
								if (types.hasKey(mimeTypes, mType)) {
									mimeTypes[mType].push(extension);
								} else {
									mimeTypes[mType] = [extension];
								};
							});
						}, {});
					};
				};
				
				mime.loadTypes = function loadTypes() {
					return mime.getOptions().hooks.resourcesLoader.locate('mimeExtensions.json')
						.then(function(location) {
							return mime.getOptions().hooks.resourcesLoader.load(location, {callback: __Internal__.parseMimeExtensions});
						});
				};


				return function init(/*optional*/options) {
					return mime.loadTypes();
				};
				
			},
		};
		
		return DD_MODULES;
	};
	
	if (typeof process !== 'object') {
		// <PRB> export/import are not yet supported in browsers
		global.DD_MODULES = exports.add(global.DD_MODULES);
	};	
}).call((typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this));
