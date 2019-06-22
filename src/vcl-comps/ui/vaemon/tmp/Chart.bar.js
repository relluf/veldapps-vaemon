$(["ui/forms/View"], {
	'@require': ["chartjs.org/Chart"]
}, [
    $i("client", {
    	css: {
    		overflow:"hidden",
    		padding: "20px"
    	},

    	/**
    	 *
    	 */
		onResize: function() {
			var Chart = require("chartjs.org/Chart");
			var data = {
			    labels: ["January", "February", "March", "April", "May", "June", "July"],
			    datasets: [
			        {
			            label: "My First dataset",
			            fillColor: "rgba(220,220,220,0.5)",
			            strokeColor: "rgba(220,220,220,0.8)",
			            highlightFill: "rgba(220,220,220,0.75)",
			            highlightStroke: "rgba(220,220,220,1)",
			            data: [65, 59, 80, 81, 56, 55, 40]
			        },
			        {
			            label: "My Second dataset",
			            fillColor: "rgba(151,187,205,0.5)",
			            strokeColor: "rgba(151,187,205,0.8)",
			            highlightFill: "rgba(151,187,205,0.75)",
			            highlightStroke: "rgba(151,187,205,1)",
			            data: [28, 48, 40, 19, 86, 27, 90]
			        }
			    ]
			};

			var canvas = this.getChildNode(0);
			var ctx = canvas.getContext("2d");

			var cs = this.getComputedStyle();
			canvas.width = parseInt(cs.width);
			canvas.height = parseInt(cs.height);
			console.log("resize", cs.width, cs.height);

			var chart = this.getVar("chart");
			if(chart !== undefined) {
				chart.destroy();
			}

			this.setVar("chart", new Chart(ctx).Bar(data, {}));
		},

		content: "<canvas width=\"400\" height=\"400\"></canvas>"
	})
]);