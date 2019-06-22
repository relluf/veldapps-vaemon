$(["ui/forms/Home"], {

	css: {
	    "> .{./Panel} > [id$=-client_editors]": {
			"padding-top": "8px",
			"padding-left": "32px"
	    }
	},

	onReceiveParams: function(params) {
		this.setCaption(this.applyVar("getCaption", [params.instance], "silent") || this.getUri());
	}

}, [
//    $i("left_content", {css:"min-height: 75px;"}),

//    $i("description", {
//    	content: "<b>Location</b> - A monitoring location describes a certain point in the area in which it resides for ever."
//    }),
//	$i("tree", {
//
//	}, [
//	    $("vcl/ui/Node", {
//	    	text: "Documenten <span style='color:silver;'>(3)</span>"
//	    }),
//	    $("vcl/ui/Node", {
//	    	text: "Onderzoeken <span style='color:silver;'>(9)</span>"
//	    }),
//	    $("vcl/ui/Node", {
//	    	text: "Meetpunten <span style='color:silver;'>(102)</span>",
//	    	vars: {
//		    	formUri: "ui/forms/persistence/View<moda/monitoring/Location>"
//	    	}
//	    }),
//	    $("vcl/ui/Node", {
//	    	text: "Analysemonsters <span style='color:silver;'>(45)</span>"
//	    })
//	]),

	$i("description", {
		content: "<b>Instance</b> - Coming soon..."
	}),

	$i("menubar", {
		visible: true
	}, [
        $("vcl/ui/Button", {
            action: "commit"
        }),
        $("vcl/ui/Button", {
            action: "revert"
        }),
        $("vcl/ui/Button", {
            action: "update"
        }),
        $("vcl/ui/Button", {
            action: "remove"
        }),
        $("vcl/ui/Element", {
            action: "busy",
            content: "Working...&nbsp;&nbsp;&nbsp;<img align='absmiddle' src='/shared/vcl/images/loading.gif'>",
            css: {
                float: "right",
                "margin-right": "8px"
            }
        })
	]),

	$i("client", {}, [
//	    $("vcl/ui/Panel", "client_editors", {
//	    	align: "client",
//			css: {
//				">:not(.header)": {
//					"margin-left": "16px"
//				},
//				">.{./Element}": {
//					"&.header": {
//						"font-weight": "bold",
//						"margin-bottom": "5px"
//					}
//				},
//				">select": {
//					"font-size": "10pt",
//					"margin-bottom": "10px"
//				},
//				">input": {
//					"font-size": "10pt",
//					"margin-bottom": "10px"
//				}
//			}
//	    }, [
//    	    $("vcl/ui/Element", {classes: "header", content: "General"}),
//
//    	    $("vcl/ui/Element", {content: "Code:"}),
//    	    $("vcl/ui/Input"),
//
//    	    $("vcl/ui/Element", {content: "Type:"}),
//    	    $("vcl/ui/Input", {
//    	    	element: "select",
//    	    	onLoad: function() {
//    	    		var node = this.getNode();
//    	    		node.innerHTML = ""+
//        			"<option>Amsterdam</option>" +
//        			"<option>Rotterdam</option>" +
//        			"<option>Utrecht</option>" +
//        			"<option>Haarlem</option>" +
//        			"<option>Heereveen</option>" +
//        			"<option>Groningen</option>" +
//        			"<option>Leeuwarden</option>" +
//        			"<option>Assen</option>" +
//        			"<option>Lelystad</option>" +
//        			"<option>Maastricht</option>" +
//        			"<option>Den Bosch</option>" +
//        			"<option>Middelburg</option>" +
//        			"<option>Zwolle</option>" +
//        			"<option>Almelo</option>";
//    	    	}
//    	    }),
//
//    	    $("vcl/ui/Element", {content: "Date:"}),
//    	    $("vcl/ui/Input",{type:"datetime"}),
//    	])
	]),

    $("vcl/Action", "commit", {
        content: "Save",
        enabled: !false,
        left: 352,
        onExecute: function () {
            var scope = this.getScope();
            scope.instance.commit();
        },
        top: 192
    }),
    $("vcl/Action", "revert", {
        content: "Revert",
        enabled: !false,
        left: 352,
        onExecute: function () {
            var scope = this.getScope();
            scope.instance.revert();
        },
        top: 232
    }),
    $("vcl/Action", "remove", {
        content: "Delete",
        enabled: !false,
        left: 352,
        onExecute: function () {
            var scope = this.getScope();
            scope.instance.remove().addCallback(function () {
                scope.close_form.execute();
            });
        },
        top: 272
    }),
    $("vcl/Action", "update", {
        content: "Refresh",
        enabled: !false,
        left: 352,
        onExecute: function () {
            var scope = this.getScope();
            scope.instance.update();
        },
        top: 312
    }),
    $("vcl/Action", "busy", {
        left: 352,
        top: 352,
        visible: false
    })


]);