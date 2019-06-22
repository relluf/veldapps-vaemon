$(["ui/vaemon/Chart.timeline"], {
    '@require': ["dygraphs.com/Dygraph"],

    classes: "loaded"

}, [

    $i("client", [
    	$("vcl/ui/Panel", {
    		align: "top",
    		autoSize: "both",
    		css: {
    			padding: "8px"
    		},
    		content: "Channels: <input> <button>Set</button>",
    		onKeyUp: function(evt) {
    			if(evt.keyCode === 13) {
    				this.onclick(evt);
    			}
    		},
    		onClick: function(evt) {
    			if(evt.target.nodeName === "BUTTON") {
					var Command = require("cavalion.org/Command");
					var me = this;
					var keys = this._node.querySelector("input").value.split(",");

					this._owner.removeClass("loaded");

					Command.execute("rest/charts/Timeline.channels", {
						begin: new Date(0),
						end: new Date(),
						keys: keys,
						limit: 10000
					}).
						addCallbacks(function(res) {
							me._owner.addClass("loaded");
							return res;
						}).
						addCallback(function(res) {

							res.list.forEach(function(tuple) {
								tuple[0] = new Date(tuple[0]);
							});

							me.applyVar("draw", [res.list, {
								labels: ["Date"].concat(keys)
							}]);
							return res;
						});
    			}
    		}
    	})
    ])
]);