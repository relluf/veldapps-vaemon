$(["ui/Form"], {

	"@require": ["chartjs.org/Chart"],
	content: "<canvas />",
	css: {
	    overflow: "hidden",
	    margin: "20px"
	},

    onReceiveParams: function() {
        var Command = require("cavalion.org/Command");
        var req = {
            channel: this.getParam("instance").getKey(), 
            begin: new Date(2014, 3, 1), 
            end: new Date(2015, 1, 1)
        };
        
        var scope = this.getScope();
        
        Command.execute("rest/charts/weeks", req).addCallback(function(tuples) {
            var data = {
                labels: [],
                datasets: [{
    	            label: "My First dataset",
    	            fillColor: "rgba(220,220,220,0.5)",
    	            strokeColor: "rgba(220,220,220,0.8)",
    	            highlightFill: "rgba(220,220,220,0.75)",
    	            highlightStroke: "rgba(220,220,220,1)",
    	            data: []
                }]
            };
            
            tuples.forEach(function(tuple) {
                data.labels.push(String.format("Week %d", tuple[1]));
                data.datasets[0].data.push(tuple[2]);
            });
            
            this.setVar("data", data);
            this.render();

        }.bind(this));
    },
    
    onRender: function() {
	    var data = this.getVar("data");
	    var chart = this.getVar("chart");
	    
	    if(chart !== undefined) {
	        chart.destroy();
	    }
	    
	    if(data === undefined) {
	        return;
	    }
	    
		var Chart = require("chartjs.org/Chart");
		var canvas = this.getChildNode(0);
        var cs = this.getComputedStyle();
        
		canvas.width = parseInt(cs.width, 10);
		canvas.height = parseInt(cs.height, 10);
		
		var ctx = canvas.getContext("2d");
		chart = new Chart(ctx).Bar(data, {
		    //barShowStroke: false
		});
		
		this.setVar("chart", chart);
    },

	onResize: function() {
	    this.setTimeout("render", 200);
	}

}, [
    
    $("vcl/ui/Panel", {
        align: "top",
        autoSize: "height",
        element: "form"
    }, [
        $("vcl/ui/Element", {
            element: "span",
            content: "Type:" 
        }),
        $("vcl/ui/Select", {
            options: "Years,Months,Weeks,Days,Hours".split(",")
        }),
        $("vcl/ui/Element", {
            element: "span",
            content: "Range: " 
        }),
        $("vcl/ui/Input", {
            type: "date"
        })
    ])
    
    
]);