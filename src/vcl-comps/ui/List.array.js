$(["ui/Form"], {}, [
    $("vcl/ui/List", "list", {
    	align: "client",
    	source: "array",
    	autoColumns: true
    }),
    $("vcl/data/Array", "array", {
    	onLoad: function() {
    		this.setArray([[this.hashCode()]]);
    	}
    })
]);