$([], {

	vars: {

		/**
		 *
		 */
		getCaption: function(instance) {
			return String.format("%s - %s", 
			        instance.getAttributeValue("node.name"), 
			        instance.getAttributeValue("name"));
		}
	}

}, [

    $i("tree", {}, [
    	$("vcl/ui/Node", {
       		text: "Measurements",
       		vars: {
       			formUri: "ui/entities/Query<Measurement.by:channel>",
       			formParams: function() {
       			    return {
       			        channel: this._owner.getParam("instance")
       			    };
       			}
       		}
       	}),
    	$("vcl/ui/Node", {
       		text: "Charts",
       		vars: {
       			formUri: "ui/vaemon/BarChart<Channel>",
       			formParams: function() {
       			    return {instance: this._owner.getParam("instance")};
       			}
       		}
       	}),
    	$("vcl/ui/Node", {
       		text: "Timeline",
       		vars: {
       			formUri: "ui/vaemon/LineChart<Channel>.timeline",
       			formParams: function() {
       			    return {instance: this._owner.getParam("instance")};
       			}
       		}
       	})
    ])
]);