$([], {}, [

    $i("description", {
    	content: "<b>Channels</b> - Channels gather data of various " +
    			"installed sensors."
    }),

	$i("query", {
		attributes: "sensor.code,node.name,sensor.name,sensor.description,created,countDistinct:measurements.id",
		entity: "Channel",
		orderBy: "node.name,sensor.code",
		groupBy: "."
	}),

    $i("list", {

    }, [
		$("vcl/ui/ListColumn", {
			content: String.fromCharCode(160),
			onGetValue: function(value, row, source) {
				return " ";//String.fromCharCode(254);
			}
		}),
		$("vcl/ui/ListColumn", {
			content: "Node",
			attribute: "node.name"
		}),
		$("vcl/ui/ListColumn", {
			content: "Code",
			attribute: "sensor.code"
		}),
		$("vcl/ui/ListColumn", {
			content: "Sensor",
			attribute: "sensor.name"
		}),
		$("vcl/ui/ListColumn", {
			content: "Description",
			attribute: "sensor.description"
		}),
		$("vcl/ui/ListColumn", {
			content: "# measurements",
			attribute: "countDistinct:measurements.id"
		})
    ])
]);