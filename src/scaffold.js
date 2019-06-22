define(function(require) {

	var mixInR = require("js/mixInRecursive");
	var EM = require("entities/EM");

	var entities = require("entities/scaffold");
	//var views = require("views/scaffold");

	EM;

	return {
		entities: mixInR(entities, {

		})
	};
});