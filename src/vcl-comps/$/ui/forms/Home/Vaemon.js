$([], {
	'@require': ["entities/EM"],
	caption: "Welcome"
}, [
    $i("description", {
    	content: "<b>Welcome</b> - Welcome to Vaemon. Select one " +
    			"of the main sections in the tree view here below. "
    }),
    $i("left", {
    	css: {
    		width: "375px"
    	}
    }),
    $i("client", {

    }, [

        $("vcl/ui/FormContainer", "charts", {
        	visible: false,
        	formUri: "ui/vaemon/Bars",
        	onGetFormParams: function() {
        		var scope = this.getScope();
        		var selection = scope.tree.getSelection();
        		if(selection.length === 1) {
	        		return selection[0].getVar("formParams");
        		}
        	}
        })

    ]),
	$i("tree", {
        css: {
//            "-webkit-transition": "top 1s",
//            "overflow-x": "hidden",
            background: "url(http://www.stiho.nl/serverspecific/default/images/" +
            		"Template/stiho.png) no-repeat left bottom",
            "padding-bottom": "75px",
            "overflow-x": "hidden"
        },

        onSelectionChange: function(selection) {
        	var scope = this.getScope();
        	if(selection.length === 1 && selection[0].getVar("control") === scope.charts) {
        		if(scope.charts._form) {
        			scope.charts._form.setParams(selection[0].getVar("formParams"));
        		}
        	}

        	return this.inherited(arguments);
        }
	}, [
	    $("vcl/ui/Node", {
    		classes: "header",
    		expanded: true,
    		expandable: true,
       		text: Vaemon.customer,
       		onChildNodesNeeded: function() {
       			var EM = require("entities/EM");
       			var Node = require("vcl/ui/Node");
       			var owner = this._owner;
       			var parent = this;
       			var scope = this.getScope();

       			EM.query("Channel", "node.name,name,sensor.name," +
       					"sensor.code", {where: EM.EB.eq("sensor.code",
       							"EPISENSOR-341"), orderBy: "name"}).
       			    addCallback(function(res) {
           			    res.instances.forEach(function(channel) {
           			        var node = new Node(owner);
           			        node.setText(String.format("%H",
               			            channel.getAttributeValue("node.name")));

           			        ["Measurements","Bars","Timeline"].forEach(function(text, i) {
           			        	var childNode = new Node(owner);
           			        	childNode.setText(text);
           			        	childNode.setParent(node);
           			        	if(i === 0) {
           			        		childNode.setVars({
						       			formUri: "ui/entities/Query<Measurement.by:channel>",
						       			formParams: {
					       			        channel: channel
						       			}
           			        		});
           			        	} else if(i === 1) {
           			        		childNode.setVar("control", scope.charts);
           			        		childNode.setVar("formParams", {channel: channel});
           			        	} else if(i === 2) {
           			        		childNode.setVars({
						       			formUri: "ui/vaemon/LineChart<Channel>.timeline",
						       			formParams: function() {
						       			    return {instance: channel};
						       			}
						       		});
           			        	}
           			        });

           			        node.setParent(parent);
           			    });
       			});
       		}
	    }),
    	$("vcl/ui/Node", {
    		classes: "header",
    		expanded: true,
    		visible: false,
       		text: Vaemon.customer,
       	}, [
	    	$("vcl/ui/Node", {
	       		text: "Gateways",
	       		visible: false,
	       		vars: {
	       			formUri: "ui/entities/Query<Gateway>"
	       		}
	       	}),
//	    	$("vcl/ui/Node", {
//	       		text: "Nodes",
//	       		vars: {
//	       			formUri: "ui/entities/Query<Node>"
//	       		}
//	       	}),
	    	$("vcl/ui/Node", {
	       		text: "Channels",
	       		vars: {
	       			formUri: "ui/entities/Query<Channel>"
	       		},
	       		expandable: true,
	       		expanded: true,
	       		onChildNodesNeeded: function() {
           			var EM = require("entities/EM");
           			var Node = require("vcl/ui/Node");
           			var owner = this._owner;
           			var parent = this;

           			EM.query("Channel", "node.name,name,sensor.name," +
           					"sensor.code", {where: EM.EB.eq("sensor.code",
           							"EPISENSOR-341"), orderBy: "name"}).
           			    addCallback(function(res) {
               			    res.instances.forEach(function(channel) {
               			        var node = new Node(owner);
               			        node.setText(String.format("%H",
                   			            channel.getAttributeValue("node.name")));
               			        node.setVars({
               			            formUri: "ui/entities/Edit<Channel>",
               			            formParams: {
               			                instance: channel
               			            }
               			        });
               			        node.setExpandable(true);
               			        node.setParent(parent);
               			    });
           			});
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
    		classes: "header",
    		expanded: true,
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
       					node.setVar("formUri", String.format("ui/entities/Query<%s>.scaffold", k));
       					node.setParent(parent);
       				});
       			});
       		}
       	})
	])
]);