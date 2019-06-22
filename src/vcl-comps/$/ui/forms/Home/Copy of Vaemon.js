$(["ui/forms/Home"], {
	'@require': ["entities/EM"],

	caption: "Welcome"

}, [
    $i("description", {
    	content: "<b>Welcome</b> - Welcome to Illuminate RZ. Select one " +
    			"of the main sections in the tree view here below. "
    }),
	$i("tree", {

		vars: {
			"factories": {

				"node": function(Node, EM, owner, parent) {
	   				return EM.query("Node", "name", {orderBy: "name"}).
	   					addCallback(function(res) {
	   						res.instances.forEach(function(instance) {
	   							var node = new Node(owner);
	   							node.setText(instance.getAttributeValue("name"));
	   							node.setExpandable(true);
	   							node.setVars({
		   							factory: "node>channel",
		   							formUri: "ui/vaemon/Chartjs<Node>",
		   							instance: instance
	   							});
	   							node.setParent(parent);
	   						});
	   					});
				},

				"node>channel": function(Node, EM, owner, parent) {
					var where = EM.EB.eq("node", parent.getVar("instance"));
	   				return EM.query("Channel", "sensor.name,sensor.code", {where:where, orderBy: "sensor.code"}).
	   					addCallback(function(res) {
	   						res.tuples.forEach(function(tuple, index) {
	   							var node = new Node(owner);
	   							node.setText(String.format("%H <span style='color:silver;'>(%H)</a>",
	   									tuple[0], tuple[1].split("-").pop()));
	   							node.setParent(parent);
	   							node.setVars({
	   								formUri: "ui/vaemon/Chartjs<Channel>",
	   								formParams: {
	   									instance: res.instances[index],
	   									label: tuple[0]
	   								}
	   							});
	   						});
	   					});
				}
			}
		},

		onNodesNeeded: function(parent) {
			var factory = parent.getVar("factory");
			if(factory !== undefined) {
				var EM = require("entities/EM");
				var Node = require("vcl/ui/Node");
				var me = this;
				var r;

				factory.split(" ").forEach(function(name) {
					var factory = me.getVar("factories." + name);
					if(factory !== undefined) {
						r = factory(Node, EM, me._owner, parent);
					}
				});

				return r;
			}
		}

	}, [
    	$("vcl/ui/Node", {
    		classes: "header",
    		expanded: false,
       		text: Vaemon.customer
       	}, [
	    	$("vcl/ui/Node", {
	       		text: "Gateways",
	       		vars: {
	       			formUri: "ui/entities/Query<Gateway>"
	       		}
	       	}),
	    	$("vcl/ui/Node", {
	       		text: "Nodes",
	       		vars: {
	       			formUri: "ui/entities/Query<Node>"
	       		}
	       	}),
	    	$("vcl/ui/Node", {
	       		text: "Channels",
	       		vars: {
	       			formUri: "ui/entities/Query<Channel>"
	       		}
	       	}),
	    	$("vcl/ui/Node", {
	       		text: "Measurements",
	       		vars: {
	       			formUri: "ui/entities/Query<Measurement>"
	       		}
	       	})
       	]),
       	$("vcl/ui/Node", {
       		enabled: false
       	}),
       	$("vcl/ui/Node", {
       		text: "Map",
   			vars: {
   				formUri: "ui/forms/geo/Map"
   			}
       	}),
       	$("vcl/ui/Node", {
       		text: "ui/List.array",
   			vars: {
   				formUri: "ui/List.array"
   			}
       	}),
       	$("vcl/ui/Node", {
       		text: "ui/entities/Query.custom",
   			vars: {
   				formUri: "ui/entities/Query.custom"
   			}
       	}),
		//	$("vcl/ui/Node", {
		//		text: ["%H", "ui/entities/Query<Measurement.by:channel.by:period>.custom.readonly.lang:du"],
		//		expandable: true,
		//		onChildNodesNeeded: function() {
		//			var Node = this.constructor;
		//			var Component = require("vcl/Component");
		//			var callee = arguments.callee;
		//			var parent = this;
		//			var arr = Component.getImplicitBasesByUri(this._text[1]);
		//			arr.forEach(function(base) {
		//				var node = new Node(parent._owner);
		//				node.setText(["%H", base]);
		//				node.setExpandable(Component.getImplicitBasesByUri(base).length);
		//				node.setParent(parent);
		//				node.setOnChildNodesNeeded(callee);
		//			});
		//
		//			this.setExpandable(arr.length);
		//		}
		//	}),
       	$("vcl/ui/Node", {
       		enabled: false
       	}),

       	$("vcl/ui/Node", {
    		classes: "header",
    		expanded: true,
       		text: "Charts"
       	}, [
	       	$("vcl/ui/Node", {
	       		text: "Test",
	   			vars: {
	   				formUri: "ui/vaemon/Chart.test"
	   			}
	       	}),
	       	$("vcl/ui/Node", {
	       		text: "chartjs.org",
	   			vars: {
	   				formUri: "ui/vaemon/Chartjs"
	   			}
	       	}),
	       	$("vcl/ui/Node", {
	    		expanded: true,
	       		text: "Timeline",
	   			expandable: true,
	   			vars: {
	   				factory: "node"
	   			}
	       	}),
	       	$("vcl/ui/Node", {
	       		text: "Weeks",
	   			expandable: true,
	   			vars: {
	   				factory: "node"
	   			}
	       	}),
	       	$("vcl/ui/Node", {
	       		text: "Months",
	   			expandable: true,
	   			vars: {
	   				factory: "node"
	   			}
	       	}),
	       	$("vcl/ui/Node", {
	       		text: "Years",
	   			expandable: true,
	   			vars: {
	   				factory: "node"
	   			}
	       	})
	    ]),
       	$("vcl/ui/Node", {
       		enabled: false
       	}),
       	$("vcl/ui/Node", {
       		text: "Editor",
       		vars: {
       			formUri: "ui/forms/Editor"
       		}
       	}),
       	$("vcl/ui/Node", {
       		enabled: false
       	}),
       	$("vcl/ui/Node", {
    		classes: "header",
       		text: "Codes"
       	}, [
	    	$("vcl/ui/Node", {
	       		text: "Sensors",
	       		vars: {
	       			formUri: "ui/entities/Query<Sensor>"
	       		}
	       	}),
	    	$("vcl/ui/Node", {
	       		text: "Units",
	       		vars: {
	       			formUri: "ui/entities/Query<Unit>"
	       		}
	       	})
	    ]),
       	$("vcl/ui/Node", {
       		enabled: false
       	}),
       	$("vcl/ui/Node", {
    		classes: "header",
       		expandable: true,
       		expanded: true,
       		text: "Model",

       		css: {
       			"span.desc": {
       				color: "silver"
       			}
       		},

       		onChildNodesNeeded: function() {
       			var EM = require("entities/EM");
       			var Node = require("vcl/ui/Node");
       			var owner = this._owner;
       			var parent = this;
       			var model;

       			function asEntity() {
       				var entity = this.getVar("entity");
       				for(var k in entity) {
       					var node = new Node(owner);
       					var ref = entity[k].split(":");
       					node.setText(String.format("%H <span class='desc'>- %H</div>", k, entity[k]));
       					node.setExpandable(ref.length === 2);
       					node.setOnChildNodesNeeded(asEntity);
       					node.setVar("entity", model[ref[1]]);
       					node.setVar("attribute", k);
       					node.setParent(this);
       				}
       			}

       			EM.getModel().addCallback(function(res) {
       				model = res;
       				js.keys(res).sort().forEach(function(k) {
       					var node = new Node(owner);
       					node.setText(k);
       					node.setExpandable(true);
       					node.setOnChildNodesNeeded(asEntity);
       					node.setVar("entity", res[k]);
       					node.setVar("formUri", String.format("prototypes/ui/entities/Query<%s>", k));
       					node.setParent(parent);
       				});
       			});
       		}
       	})
	])
]);