$([], {

	onReceiveParams: function() {
		var Command = require("cavalion.org/Command");
		var me = this;

//		this.addClass("loading", true);

		Command.execute("rest/charts/Timeline.channel", {
			begin: new Date(0),
			end: new Date(),
			key: this.getParam("instance").getKey(),
			limit: 10000
		}).
			addCallbacks(function(res) {
				me.addClass("loaded");
				return res;
			}).
			addCallback(function(res) {

				res.list.forEach(function(tuple) {
					tuple[0] = new Date(tuple[0]);
				});

				me.applyVar("draw", [res.list, {
					labels: ["Date", me.getParam("label")]
				}]);
				return res;
			});
	}

});