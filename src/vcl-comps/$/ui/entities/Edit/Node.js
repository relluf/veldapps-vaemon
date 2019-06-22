$([], {

    css: {
        "padding": "32px",
        ".panel[id$='-client']": {
            ".{./Group}": {
                "div.label": {
                    //color: "gray",
                    "padding-left": "3px"
                },
                ">input": {
                    "margin-bottom": "20px",
                    "font-family": "inherit",
                    "font": "14pt",
                    padding: "2px",
                    "&.readonly": {
                        color: "silver"
                    }
                }
            }
        }
    },

	vars: {

		/**
		 *
		 */
		getCaption: function(instance) {
			return String.format("%H", instance.getAttributeValue("code"));
		}
	},

	/**
	 *
	 */
	onReceiveParams: function(params) {
	    var Method = require("js/Method");

		var scope = this.getScope();

        scope.gateway.setValue(params.instance.getAttributeValue("gateway"));
        scope.name.setValue(params.instance.getAttributeValue("name"));
        scope.code.setValue(params.instance.getAttributeValue("code"));

        Method.connect(params.instance, "notifyEvent", {
            connect: function() {
                scope.gateway.setValue(params.instance.getAttributeValue("gateway"));
                scope.name.setValue(params.instance.getAttributeValue("name"));
                scope.code.setValue(params.instance.getAttributeValue("code"));
                //console.log(this, arguments);
                scope.commit.setEnabled(params.instance.isDirty());
                scope.revert.setEnabled(params.instance.isDirty());
            }
        }, "connect");

        params.instance.notifyEvent("changed");

		return this.inherited(arguments);
	}

}, [

    $i("commit", {
        onExecute: function() {
            var Command = require("cavalion.org/Command");
            var scope = this.getScope();
            this.setEnabled(false);

            var me = this;
            Command.execute("POST:rest/entities/Node.set", {
                name: scope.name.getValue(),
                key: scope['@owner'].getParam("instance").getKey()
            }).addCallbacks(function(res) {
                me.setEnabled(true);
                return res;
            });
        }
    }),

    $i("revert", {
        onExecute: function() {
            this._owner,getParameter(instance).revert();
        }
    }),

    $i("remove", {
        visible: false
    }),

    $i("refresh", {
        //visible: false
    }),

    $i("description", {
        content: "<b>Node</b> - A node ..."
    }),

    $i("tree", {}, []),

    $i("client", {
    }, [
        $("vcl/ui/Group", {}, [
            $("vcl/ui/Element", {
                classes: "label",
                content: "Gateway:"
            }),
            $("vcl/ui/Input", "gateway", {
                classes: "readonly",
                onNodeCreated: function() {
                    this._node.readOnly = true;
                }
            }),

            $("vcl/ui/Element", {
                classes: "label",
                content: "Name:"
            }),
            $("vcl/ui/Input", "name", {
                onChange: function() {
                    this._owner.getParam("instance").setAttributeValue("name",
                        this.getValue());
                }
            }),

            $("vcl/ui/Element", {
                classes: "label",
                content: "Code:"
            }),
            $("vcl/ui/Input", "code", {
                onChange: function() {
                    this._owner.getParam("instance").setAttributeValue("code",
                        this.getValue());
                }
            })

        ])
    ])
]);