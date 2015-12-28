//! REPLACE_BY("// Copyright 2015 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework with some extras
// File: Tools_Mime.js - Mime Tools
// Project home: https://sourceforge.net/projects/doodad-js/
// Trunk: svn checkout svn://svn.code.sf.net/p/doodad-js/code/trunk doodad-js-code
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2015 Claude Petit
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
	if (global.process) {
		module.exports = exports;
	};
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Tools.Mime'] = {
			type: null,
			version: '0b',
			namespaces: null,
			dependencies: ['Doodad.Tools', 'Doodad.Types', 'Doodad.Namespaces', 'Doodad.Modules'],
			
			create: function create(root, /*optional*/_options) {
				"use strict";
				
				var doodad = root.Doodad,
					types = doodad.Types,
					tools = doodad.Tools,
					namespaces = doodad.Namespaces,
					modules = doodad.Modules,
					config = tools.Config,
					mime = tools.Mime;
				
				var __Internal__ = {
					mimeExtensions: null,
					mimeTypes: null,
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
				
				mime.loadTypes = function loadTypes(/*optional*/callback) {
					// Remote file test
					//var configPath = null;
					//config.loadFile('http://localhost/doodadjs/res/mimeExtensions.json', 
						
					var configPath = tools.getCurrentScript((global.document?document.currentScript:module.filename) || (function (){ try { throw new Error(""); } catch (ex) { return ex; } })());
					return modules.locate('doodad-js-mime').then(function(location) {
						var path = tools.options.hooks.pathParser(global.process && root.startupOptions.settings.fromSource ? './src/common/res/mimeExtensions.json' : './res/mimeExtensions.json');
						return config.loadFile(path, { async: true, watch: true, configPath: location, encoding: 'utf8' }, [__Internal__.parseMimeExtensions, callback]);
					});
				};


				return function init(/*optional*/options) {
					return mime.loadTypes();
				};
				
			},
		};
		
		return DD_MODULES;
	};
	
	if (!global.process) {
		// <PRB> export/import are not yet supported in browsers
		global.DD_MODULES = exports.add(global.DD_MODULES);
	};	
})();
