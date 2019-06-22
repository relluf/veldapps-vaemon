$([], {

}, [

    $i("list", {
    	autoColumns: true
    }),

    $("vcl/ui/Panel", {
    	autoSize: "both",
    	align: "top",
    	element: "form",
    	css: {
    		"input": {
    			display: "inline-block",
    			"margin-right": "8px"
    		},
    		"div": {
    			display: "inline-block"
    		},
    		"padding-bottom": "4px"
    	},
    	onNodeCreated: function() {
    		var scope = this.getScope();

    		var frame = document.createElement("iframe");
    		frame.name = frame.id = String.format("frame%d", Date.now());
    		frame.src = "autocomplete";
    		document.body.appendChild(frame);

    		var form = this._node;
    		form.method = "POST";
    		form.target = frame.id;

    		this._node.onsubmit= function() {
    			try {
    				scope.query.setAll(
    						scope.entity.getValue(),
    						scope.attributes.getValue(),
    						undefined,
    						scope.groupBy.getValue(),
    						scope.orderBy.getValue());

    				return;
    			} catch(e) {
    				alert(e.message);
    				//return false;
    			} finally {
	    			document.body.removeChild(frame);
		    		frame = document.createElement("iframe");
		    		frame.name = frame.id = String.format("frame%d", Date.now());
		    		frame.src = "autocomplete";
		    		document.body.appendChild(frame);
		    		form.target = frame.id;
    			}
    		};
    	}
    }, [
        $("vcl/ui/Element", {
        	content: "Entity:"
        }),
        $("vcl/ui/Input", "entity", {
        }),
        $("vcl/ui/Element", {
        	content: "Attributes:"
        }),
        $("vcl/ui/Input", "attributes", {
        }),
        $("vcl/ui/Element", {
        	content: "Group By:"
        }),
        $("vcl/ui/Input", "groupBy", {
        }),
        $("vcl/ui/Element", {
        	content: "Order By:"
        }),
        $("vcl/ui/Input", "orderBy", {
        }),
        $("vcl/ui/Input", {
        	type: "submit",
        	value: "Go!"
        })
    ])


]);