$([], {

	vars: {

		/**
		 *
		 */
		getCaption: function(instance) {
			return String.format("%H", instance.getAttributeValue("name"));
		}
	}

}, [

    $i("tree", {

    }, [
    	$("vcl/ui/Node", {
       		text: "Nodes",
       		vars: {
       			formUri: "ui/entities/Query<Node>"
       		}
       	})
    ])
]);