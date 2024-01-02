/*\
title: $:/plugins/tiddlywiki/multiwikiserver/init.js
type: application/javascript
module-type: startup

Multi wiki server initialisation

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "multiwikiserver";
exports.platforms = ["node"];
exports.before = ["story"];
exports.synchronous = true;

exports.startup = function() {
	// Install the sqlite3 global namespace
	$tw.sqlite3 = {
		Database: null
	};
	// Check that better-sqlite3 is installed
	var logger = new $tw.utils.Logger("multiwikiserver");
	try {
		$tw.sqlite3.Database = require("better-sqlite3");
	} catch(e) {
	}
	if(!$tw.sqlite3.Database) {
		logger.alert("The plugin 'tiddlywiki/multiwikiserver' requires the better-sqlite3 npm package to be installed. Run 'npm install' in the root of the TiddlyWiki repository");
		return;
	}
	// Create and initialise the tiddler store
	var SqlTiddlerStore = require("$:/plugins/tiddlywiki/multiwikiserver/sql-tiddler-store.js").SqlTiddlerStore;
	$tw.sqlTiddlerStore = new SqlTiddlerStore({});
	$tw.sqlTiddlerStore.createTables();
	// Create bags and recipes
	$tw.sqlTiddlerStore.saveBag("bag-alpha");
	$tw.sqlTiddlerStore.saveBag("bag-beta");
	$tw.sqlTiddlerStore.saveBag("bag-gamma");
	$tw.sqlTiddlerStore.saveRecipe("recipe-rho",["bag-alpha","bag-beta"]);
	$tw.sqlTiddlerStore.saveRecipe("recipe-sigma",["bag-alpha","bag-gamma"]);
	// Save tiddlers
	$tw.sqlTiddlerStore.saveTiddler({title: "Another Tiddler",text: "I'm in alpha",tags: "one two three"},"bag-alpha");
	$tw.sqlTiddlerStore.saveTiddler({title: "Hello There",text: "I'm in alpha as well",tags: "one two three"},"bag-alpha");
	$tw.sqlTiddlerStore.saveTiddler({title: "Hello There",text: "I'm in beta",tags: "four five six"},"bag-beta");
	$tw.sqlTiddlerStore.saveTiddler({title: "Hello There",text: "I'm in gamma",tags: "seven eight nine"},"bag-gamma");
};

})();