$([], {}, [

    $i("description", {
    	content: "<b>Nodes</b> - Nodes act like measurepoints to the system. Nodes " +
    			"consist of channels which actually gather the data of various " +
    			"installed sensors."
    }),

	$i("query", {
		attributes: "gateway.name,name,code,created,countd:channels",
//		from: "Node",
		groupBy: "code"
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
			content: "Gateway",
			attribute: "gateway.name"
		}),
		$("vcl/ui/ListColumn", {
			content: "Name",
			attribute: "name"
		}),
		$("vcl/ui/ListColumn", {
			content: "Code",
			attribute: "code"
		}),
		$("vcl/ui/ListColumn", {
			content: "Channels",
			attribute: "countd:channels"
		})
    ])
/*
	       	    $("vcl/ui/CheckGroup", {
	       	        css: {
	       	            "padding-right": "8px",
	       	            ".{./Input}": {
	       	                width: "100%"
	       	            }
	       	        },
	       	        text: "Name",
	       	        visible: false
	       	    }, [
	       	        $("vcl/ui/Input")
	       	    ])
*/


]);