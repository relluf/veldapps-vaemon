$([], {}, [

	$i("query", {
		attributes: "code,name,created,countd:nodes",
		entity: "Gateway",
		groupBy: ".",
		orderBy: "name"
	}),

    $i("list", {}, [
		$("vcl/ui/ListColumn", {
			content: String.fromCharCode(160),
			onGetValue: function(value, row, source) {
				return " ";//String.fromCharCode(254);
			}
		}),
		$("vcl/ui/ListColumn", {
			content: "Code",
			attribute: "code"
		}),
		$("vcl/ui/ListColumn", {
			content: "Name",
			attribute: "name"
		}),
		$("vcl/ui/ListColumn", {
			content: "Created",
			attribute: "created"
		}),
		$("vcl/ui/ListColumn", {
			content: "Nodes",
			attribute: "countd:nodes"
		})
    ]),

    $i("description", {
    	content: "<b>Gateways</b> - A gateway consists of a collection " +
    			"of nodes collecting various quantities of data, grouped in channels. " +
    			"Gateways periodically report measurements to the system."
    })
]);