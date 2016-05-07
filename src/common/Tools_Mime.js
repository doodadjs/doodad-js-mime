//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
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
	
	//! BEGIN_REMOVE()
	if ((typeof process === 'object') && (typeof module === 'object')) {
	//! END_REMOVE()
		//! IF_DEF("serverSide")
			module.exports = exports;
		//! END_IF()
	//! BEGIN_REMOVE()
	};
	//! END_REMOVE()
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Tools.Mime'] = {
			version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE() */,
			
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


				mime.setOptions({
					resourcesPath: './res/', // Combined with package's root folder
					hooks: {
						// TODO: Make a better and common resources locator and loader
						resourcesLoader: {
							locate: function locate(fileName, /*optional*/options) {
								var Promise = types.getPromise();
								var filesOptions = files.getOptions();
								var mimeOptions = mime.getOptions();
								var path = tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})())
									.set({file: null})
									.combine(filesOptions.hooks.pathParser(mimeOptions.resourcesPath))
									.combine(filesOptions.hooks.pathParser(fileName));
								return Promise.resolve(path);
							},
							load: function load(path, /*optional*/options) {
								return config.loadFile(path, { async: true, watch: true, encoding: 'utf-8' }, types.get(options, 'callback'));
							},
						},
					},
				}, _options);
					
				mime.getTypes = function(fileName, /*optional*/defaultType) {
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
						});
					};
				};
				
				mime.loadTypes = function loadTypes() {
					return mime.getOptions().hooks.resourcesLoader.locate('mimeExtensions.json')
						.then(function(location) {
							return mime.getOptions().hooks.resourcesLoader.load(location, {callback: __Internal__.parseMimeExtensions});
						});
				};

				
				mime.setType = function(name, ext) {
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
	};
	
	//! BEGIN_REMOVE()
	if ((typeof process !== 'object') || (typeof module !== 'object')) {
	//! END_REMOVE()
		//! IF_UNDEF("serverSide")
			// <PRB> export/import are not yet supported in browsers
			global.DD_MODULES = exports.add(global.DD_MODULES);
		//! END_IF()
	//! BEGIN_REMOVE()
	};
	//! END_REMOVE()
}).call(
	//! BEGIN_REMOVE()
	(typeof window !== 'undefined') ? window : ((typeof global !== 'undefined') ? global : this)
	//! END_REMOVE()
	//! IF_DEF("serverSide")
	//! 	INJECT("global")
	//! ELSE()
	//! 	INJECT("window")
	//! END_IF()
);