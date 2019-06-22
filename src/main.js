require.config({
	paths: {
		"ace": "/shared/vcl/lib/ajax.org/ace/lib/ace",
		"cavalion.org": "/shared/vcl/lib/cavalion.org",
		"chartjs.org": "/shared/vcl/lib/chartjs.org",
		"dygraphs.com": "/shared/vcl/lib/dygraphs.com/1.0.1",
		"js": "/shared/vcl/lib/cavalion.org/js",
		"persistence": "/shared/vcl/lib/cavalion.org/persistence2",
		"entities": "/shared/vcl/lib/cavalion.org/entities",
		"linq": "/shared/vcl/lib/linq-2.2.0.2",
		"leaflet": "/shared/vcl/lib/leafletjs.com/leaflet-0.7.2/leaflet-boot",
		"ol": "/shared/vcl/lib/openlayers.org/ol",
		"text": "/shared/vcl/lib/text",
		"vcl": "/shared/vcl/lib/cavalion.org/vcl"
	}
});

define(function(require) {
	/** main main **/
	require("cavalion.org/console/Printer");

	var Component = require("vcl/Component");
	var Factory = require("vcl/Factory");

	var Node = require("cavalion.org/console/Node");
	var ComponentNode = require("cavalion.org/console/node/vcl/Component");

	var js = require("js");
	js.override(Node, "create", function(value, key, NodeClass) {
		if(NodeClass === undefined && value instanceof Component) {
			// specific Component impl
			return new ComponentNode(value, key);
		}
		return js.inherited(this, arguments);
	});

	// handy dandy
	window.js = js;

	Factory.require("App<Vaemon>.desktop.scaffold", function(factory) {
		factory.newInstance();
	});
});