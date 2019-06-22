$([], {}, [
    
    $i("description", {
        content: "<b>Measurements</b> - View of all measurement currently imported into the system. A measurement is associated with a channel and produced by a sensor at a specific point in time."
    }),

	$i("query", {
		attributes: "channel.node.name,channel.name,timestamp,value,channel.sensor.unit.code,channel.sensor.name",
		entity: "Measurement",
		orderBy: "timestamp desc"//,channel.node.name,channel.sensor.code"
	}),

	$i("item_open", {
		enabled: false
	}),

    $i("list", {}, [
// 		$("vcl/ui/ListColumn", {
// 			content: String.fromCharCode(160),
// 			onGetValue: function(value, row, source) {
// 				return row;//" ";//String.fromCharCode(254);
// 			}
// 		}),
// 		$("vcl/ui/ListColumn", {
// 			content: "Node",
// 			attribute: "channel.node.name"
// 		}),
// 		$("vcl/ui/ListColumn", {
// 			attribute: "timestamp"
// 		}),
// 		$("vcl/ui/ListColumn", {
// 			content: "Value",
// 			attribute: ".",
// 			onGetValue: function(value, row, source) {
// 				return String.format("%s %H",
// 						value.getAttributeValue("value"),
// 						value.getAttributeValue("channel.sensor.unit.code"));
// 			}
// 		}),
// 		$("vcl/ui/ListColumn", {
// 			content: "Sensor",
// 			attribute: "channel.sensor.name"
// 		}),
// 		$("vcl/ui/ListColumn", {
// 			content: "Channel",
// 			attribute: "channel.name"
// 		})
    ])
]);