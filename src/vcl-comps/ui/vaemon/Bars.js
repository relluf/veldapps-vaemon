$(["ui/forms/View"], {

    "@require": ["chartjs.org/Chart"],

    css: {
        padding: "10px"
    },

    /**
     *
     */
    onDispatchChildEvent: function(component, name, evt, f, args) {
	    var obj = this.getVar("events." + component._name);
	    if(obj !== undefined) {
	    	var mth = obj["on" + name];
		    if(typeof mth === "function") {
		    	return mth.apply(obj, [component, name, evt, args]);
		    }
	    }
    },

    /**
     *
     */
    onReceiveParams: function () {
        this.setTimeout("start", function () {
            this.applyVar("request", []);
        }.bind(this), 200);
    },

    vars: {

    	/**
    	 *
    	 */
    	refresh: function() {

    	},

    	/**
    	 *
    	 */
    	updateDates: function(selector, tx) {
    		var scope = selector.getScope();
    		var DAY = 1000 * 60 * 60 * 24;
    		var HOUR = 1000 * 60 * 60;
			var min = selector.getVar("min");
			var max = selector.getVar("max");
			var width = selector.getVar("width");
			var pos = (-tx - min) + min + max;
			var mode = selector.getVar("mode");
			var n_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        	var months = ("Jan,Feb,Mar,Apr,May," +
    			"Jun,Jul,Aug,Sep,Oct," +
    			"Nov,Dec").split(",");

			var dt = new Date(selector.getVar("min-date").getTime());
			var n = parseInt(pos / 35, 10);
			if(mode === "hours") {
				n = parseInt(pos / 25, 10);
				dt.setTime(dt.getTime() + HOUR * n);
				dt.setTime(dt.getTime() + (pos % 25) / 25 * HOUR);
				selector.setVar("begin", new Date(dt.getTime()));
				scope.date_from.setContent(String.format(
						"<div>%s %d</div>%d<div class='time'>%d:%02d</div>",
						months[dt.getMonth()], dt.getDate(), dt.getFullYear(),
						dt.getHours(), parseInt(dt.getMinutes() / 15) * 15));

				dt.setTime(dt.getTime() + width / 25 * HOUR);
				selector.setVar("end", new Date(dt.getTime()));
				scope.date_to.setContent(String.format(
						"<div>%s %d</div>%d<div class='time'>%d:%02d</div>",
						months[dt.getMonth()], dt.getDate(), dt.getFullYear(),
						dt.getHours(), parseInt(dt.getMinutes() / 15) * 15));

			} else if(mode == "days") {
				dt.setTime(dt.getTime() + DAY * n);
				dt.setTime(dt.getTime() + (pos % 35) / 35 * DAY);
				selector.setVar("begin", new Date(dt.getTime()));
				scope.date_from.setContent(String.format(
						"<div>%s %d</div>%d<div class='time'>%d:%02d</div>",
						months[dt.getMonth()], dt.getDate(), dt.getFullYear(),
						dt.getHours(), parseInt(dt.getMinutes() / 15) * 15));

				dt.setTime(dt.getTime() + DAY * (width / 35));
				selector.setVar("end", new Date(dt.getTime()));
				scope.date_to.setContent(String.format(
						"<div>%s %d</div>%d<div class='time'>%d:%02d</div>",
						months[dt.getMonth()], dt.getDate(), dt.getFullYear(),
						dt.getHours(), parseInt(dt.getMinutes() / 15) * 15));
			} else if(mode === "weeks") {
				dt.setDate(dt.getDate() + n * 7);
				dt.setDate(dt.getDate() + (pos % 35) / 35 * 7);
				selector.setVar("begin", new Date(dt.getTime()));
				scope.date_from.setContent(String.format("<div>%s %d</div>%d",
						months[dt.getMonth()], dt.getDate(), dt.getFullYear()));

				dt.setDate(dt.getDate() + width / 35 * 7);
				selector.setVar("end", new Date(dt.getTime()));
				scope.date_to.setContent(String.format("<div>%s %d</div>%d",
						months[dt.getMonth()], dt.getDate(), dt.getFullYear()));
			} else if("months") {
				dt.setMonth(dt.getMonth() + n);
				dt.setDate(parseInt((pos % 35) / 35 * n_days[dt.getMonth()] + 1.5));
				selector.setVar("begin", new Date(dt.getTime()));
				scope.date_from.setContent(String.format("<div>%s %d</div>%d",
						months[dt.getMonth()], dt.getDate(), dt.getFullYear()));

				dt.setYear(dt.getFullYear() + 1);
				dt.setDate(dt.getDate() - 1);
				selector.setVar("end", new Date(dt.getTime()));
				scope.date_to.setContent(String.format("<div>%s %d</div>%d",
						months[dt.getMonth()], dt.getDate(), dt.getFullYear()));
			}
    	},

    	/**
    	 *
    	 */
    	scrollTo: function(selector, node, x) {
			var dx = node.style['-webkit-transform'] || "translate3d(0, 0, 0)";
			dx = parseInt(dx.split("(").pop().split(",").shift(), 10);
			if(dx !== x) {
				if(!selector.hasClass("animate")) {
					selector.addClass("animate");
//					selector.setEnabled(false);
					selector.update(function() {
						node.style['-webkit-transform'] =
							String.format("translate3d(%dpx, 0, 0)", x);
					});
				} else {
//					node.style['-webkit-transform'] =
//						String.format("translate3d(%dpx, 0, 0)", x);
				}
			}
			this.applyVar("updateDates", [selector, x]);
			selector.setTimeout("request", function() {
				selector._owner.applyVar("request", []);
			}, 500);
        },

        /**
         *
         */
        request: function () {
            var Command = require("cavalion.org/Command");
            var RenderLabel = this.getVar("RenderLabel");
            var Prepare = this.getVar("Prepare");

            var scope = this.getScope();
            var type = scope.selector.getVar("mode");
            var req = {
                channel: this.getParam("channel").getKey()
            };

            req.begin = new Date(scope.selector.getVar("begin").getTime());
            req.end = new Date(scope.selector.getVar("end").getTime());

            Command.execute("rest/charts/" + type, req).addCallback(function (tuples) {
                var data = {
                    labels: [],
                    datasets: [{
                        label: "Usage",
                        fillColor: "rgba(56, 121, 217, 0.6)",
                        strokeColor: "rgb(56, 121, 217, 0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: []
                    }]
                };

                tuples = Prepare[type](tuples, req);
                tuples.forEach(RenderLabel[type].bind(data));

                scope.chart.setVar("data", data);
                scope.chart.render();
            });
    	},

	    events: {
	    	"selector": {
	    		onmousedown: function(selector, name, evt, args) {
	    			var DocumentHook = require("cavalion.org/util/DocumentHook");

    				var bar = selector.getChildNode(0);
	    			var x = evt.clientX;
	    			var dx = bar.style['-webkit-transform'] || "translate3d(0, 0, 0)";
	    			dx = parseInt(dx.split("(").pop().split(",").shift(), 10);

	    			var hook = new DocumentHook(undefined, false, {
	    				mousemove: function(evt) {
	    					var tx = dx + (evt.clientX - x);
		    				bar.style['-webkit-transform'] =
		    					String.format("translate3d(%dpx, 0, 0)", tx);

		    				selector._owner.applyVar("updateDates", [selector, tx]);

		    				evt.preventDefault();
	    				},
	    				mouseup: function(evt) {
		    				dx += evt.clientX - x;
		    				bar.style['-webkit-transform'] =
		    					String.format("translate3d(%dpx, 0, 0)", dx);

			    			var max = selector.getVar("max");
			    			var min = selector.getVar("min");

	    					hook.release();

		    				if(dx > max) {
		    					selector._owner.applyVar("scrollTo", [selector, bar, max]);
		    				} else if(dx < min) {
		    					selector._owner.applyVar("scrollTo", [selector, bar, min]);
		    				} else {
			    				selector.setTimeout("request", function() {
			    					selector._owner.applyVar("request", []);
			    				}, 500);
		    				}
	    				}
	    			});
	    			hook.activate();
	    		}
	    	}
	    },

        RenderLabel: {
            years: function (tuple) {
                this.labels.push(tuple[0]);
                this.datasets[0].data.push(tuple[1]);
            },
            months: function (tuple) {
                var months = ("January,February,March,April,May,June,July," +
                    "August,September,October,November,December").split(",");

                this.labels.push(String.format("%s %d", months[tuple[1]], tuple[0]));
                this.datasets[0].data.push(tuple[2]);
            },
            weeks: function (tuple) {
                this.labels.push(String.format("Week %d", tuple[1] + 1));
                this.datasets[0].data.push(tuple[2]);
            },
            days: function (tuple) {
                var days = "Mon,Tue,Wed,Thu,Fri,Sat,Sun".split(",");
                var dt = new Date(tuple[0], tuple[1], tuple[2]);
                this.labels.push(String.format("%s %2d", days[(dt.getDay() + 3) % 7], tuple[2]));
                this.datasets[0].data.push(tuple[3]);
            },
            hours: function (tuple) {
                this.labels.push(String.format("%02d", tuple[3]));
                this.datasets[0].data.push(tuple[4]);
            }
        },

        Prepare: {
        	months: function(tuples, req) {
        		var r = [];
        		var dt = new Date(req.begin.getTime());

        		function find(y, m) {
        			for(var i = 0; i < tuples.length; ++i) {
        				if(tuples[i][0] === y && tuples[i][1] === m) {
        					return tuples[i][2];
        				}
        			}
        			return 0;
        		}

        		while(dt.getTime() < req.end.getTime()) {
        			var y = dt.getFullYear();
        			var m = dt.getMonth();
        			r.push([y, m, find(y, m)]);
        			dt.setMonth(dt.getMonth() + 1);
        		}

        		return r;
        	},
        	weeks: function(tuples, req) {
        		var r = [];
        		var dt = new Date(req.begin.getTime());

        		function find(y, w) {
        			for(var i = 0; i < tuples.length; ++i) {
        				if(tuples[i][0] === y && tuples[i][1] === w) {
        					return tuples[i][2];
        				}
        			}
        			return 0;
        		}

        		while(dt.getTime() < req.end.getTime()) {
        			var y = dt.getFullYear();
        			var w = dt.getWeekNumber();
        			r.push([y, w, find(y, w)]);
        			dt.setDate(dt.getDate() + 7);
        		}

        		return r;
        	},
        	days: function(tuples, req) {
        		var r = [];
        		var dt = new Date(req.begin.getTime());

        		function find(y, m, d) {
        			for(var i = 0; i < tuples.length; ++i) {
        				if(tuples[i][0] === y && tuples[i][1] === m && tuples[i][2] === d) {
        					return tuples[i][3];
        				}
        			}
        			return 0;
        		}

        		while(dt.getTime() < req.end.getTime()) {
        			var y = dt.getFullYear();
        			var m = dt.getMonth() + 1;
        			var d = dt.getDate();
        			r.push([y, m, d, find(y, m, d)]);
        			dt.setDate(dt.getDate() + 1);
        		}

        		return r;
        	},
        	hours: function(tuples, req) {
        		var r = [];
        		var dt = new Date(req.begin.getTime());

        		function find(y, m, d, h) {
        			for(var i = 0; i < tuples.length; ++i) {
        				if(tuples[i][0] === y && tuples[i][1] === m && tuples[i][2] === d && tuples[i][3] === h) {
        					return tuples[i][4];
        				}
        			}
        			return 0;
        		}

        		while(dt.getTime() < req.end.getTime()) {
        			var y = dt.getFullYear();
        			var m = dt.getMonth() + 1;
        			var d = dt.getDate();
        			var h = dt.getHours();
        			r.push([y, m, d, h, find(y, m, d, h)]);
        			dt.setHours(dt.getHours() + 1);
        		}

        		return r;
        	},
        }
    }

}, [

    $i("description", {
    	content: "<b>Bars</b> - This form enables users to analyse the data of a channel in " +
    			"the form of bar charts. A period can be selected by making " +
    			"use of the slider at the top of the form."
    }),

    $("vcl/ui/Panel", {
    	align: "top",
    	autoSize: "height",
    	css: {
    		"-webkit-user-select": "none",
			"text-align": "center",
    		">.option": {
    			display: "inline-block",
    			"vertical-align": "bottom",
    			"font-size": "16pt",
				"margin-left": "10px",
    			"margin-right": "10px",
    			"padding": "2px",
    			"padding-left": "6px",
    			"padding-right": "6px",
    			"cursor": "pointer",
    			"&.selected": {
					"font-weight": "bold",
    				"background-color": "rgb(56, 121, 217)",
    				"border-radius": "5px",
    				"color": "white"
    			}
    		},
			">.date": {
				height: "48px",
				"vertical-align": "top",
				display: "inline-block",
				width: "100px",
				"text-align": "center",
				"font-size": "7pt",
				">div": {
					"font-size": "12pt",
					"&.time": {
						"font-size": "8pt"
					}
				},
				"&.left": {
					left: "0"
				},
				"&.right": {
					right: "0"
				}
			},
			">.button": {
				display: "inline-block",
				"font-size": "15pt",
				cursor: "pointer",
				"&:active":{
					"background-color": "yellow"
				}
			}
    	}
    }, [
		$("vcl/ui/Group", "back", {
			classes: "button",
        	content: String.fromCharCode(9664),
			onClick: function(evt) {
				var scope = this.getScope();
				var selector = scope.selector;
    			var max = selector.getVar("max");
    			var min = selector.getVar("min");
    			var width = selector.getVar("width");
    			var bar = selector.getChildNode(0);
				var pos = bar.style['-webkit-transform'] || "translate3d(0, 0, 0)";
				pos = parseInt(pos.split("(").pop().split(",").shift(), 10);

    			var x = pos + width;

				if(x > max) {
					x = max;
				} else if(x < min) {
					x = min;
				}

				scope['@owner'].applyVar("scrollTo", [selector, bar , x]);
			}
		}),
		$("vcl/ui/Group", "date_from", {
			classes: "date left",
			onDblClick: function(evt) {
				evt.preventDefault();
				var scope = this.getScope();
				this._owner.applyVar("scrollTo", [scope.selector, scope.selector.getChildNode(0), scope.selector.getVar("max")]);
			}
		})
    ].concat("Months,Weeks,Days,Hours".split(",").map(function(item, i) {
    	return $("vcl/ui/Element", {
    		content: String.format("%H", item),
    		classes: "option",
    		groupIndex: 1,
    		selected: i === 3,
    		onTap: function() {
    			var scope = this.getScope();
    			var modes = ["months", "weeks", "days", "hours"];
    			var selected = this.getSelected();
    			if(!selected) {
	    			scope.selector.setVar("mode", modes[this.getIndex() - 2]);
	    			this.setSelected(true);
	    			scope.selector.recreateNode();
    			}
    		}
    	});
    })).concat([
		$("vcl/ui/Group", "date_to", {
			classes: "date right",
			onDblClick: function(evt) {
				evt.preventDefault();
				var scope = this.getScope();
				this._owner.applyVar("scrollTo", [scope.selector, scope.selector.getChildNode(0), scope.selector.getVar("min")]);
			}
		}),
		$("vcl/ui/Group", "forward", {
			classes: "button",
        	content: String.fromCharCode(9654),
			onClick: function(evt) {
				var scope = this.getScope();
				var selector = scope.selector;
    			var max = selector.getVar("max");
    			var min = selector.getVar("min");
    			var width = selector.getVar("width");
    			var bar = selector.getChildNode(0);
				var pos = bar.style['-webkit-transform'] || "translate3d(0, 0, 0)";
				pos = parseInt(pos.split("(").pop().split(",").shift(), 10);

    			var x = pos - width;

				if(x > max) {
					x = max;
				} else if(x < min) {
					x = min;
				}

				scope['@owner'].applyVar("scrollTo", [selector, bar , x]);
			}
		})
    ])),

    $("vcl/ui/Panel", "selector", {
        align: "top",
        autoSize: "height",
        vars: {mode: "hours"},
    	css: {
    		"padding-top": "20px",
    		"overflow": "hidden",
    		"&:active": {
    			cursor: "pointer"
    		},
			"&.animate": {
				">.bar": {
					"-webkit-transition": "-webkit-transform 0.55s"
				}
			},
			"&.hours": {
				">.bar": {
					">div": {
						width: "25px"
					}
				},
				">.selection": {
					width: "600px"
				}
			},
    		">.bar": {
    			"white-space": "nowrap",
    			"text-align": "center",
    			">div": {
	    			"display": "inline-block",
	    			"width": "35px",
//	    			"overflow": "hidden",
	    			">div": {
	    				"border-left": "1px solid silver",
	    				"&:last-child": {
	    					"border-right": "1px solid silver"
	    				},
	    				"font-size": "6pt"
	    			}

    			}
    		},
    		">.selection": {
    			width: "420px",
    			margin: "auto",
    			height: "40px",
    			position: "relative",
    			top: "-35px",
    			left: "0",
    			border: "1px solid rgb(56, 121, 217)",
    			"background-color": "rgba(56, 121, 217, 0.4)",
    			"border-radius": "8px"
    		},
    		".from": {
    			position: "absolute",
    			top: "50px",
    			left: "50px"
    		},
    		".to": {
    			position: "absolute",
    			top: "50px",
    			right: "50px"
    		}

    	},

    	/**
    	 *
    	 */
        onNodeCreated: function() {
        	var DAY = 1000 * 60 * 60 * 24;
        	var months = ("Jan,Feb,Mar,Apr,May," +
    			"Jun,Jul,Aug,Sep,Oct," +
    			"Nov,Dec").split(",");
        	var days = ("Mon,Tue,Wed,Thu,Fri,Sat,Sun").split(",");

        	var html = [];
        	var mode = this.getVar("mode");
    		var today = new Date();
        	var year = today.getFullYear() - 5;
        	var month = today.getMonth(), prev;
    		var dt = new Date();
    		dt.setHours(0, 0, 0, 0);
    		dt.setYear(year);
    		dt.setMonth(month);
    		dt.setDate(today.getDate());

    		this.setVar("min-date", dt);
    		this.setVar("max-date", today);

    		if(mode === "hours") {
    			dt.setYear(year + 5);
    			dt.setMonth(month - 6);
    			this.setVar("min-date", new Date(dt.getTime()));

        		while(dt.getTime() < today.getTime()) {
        			var day = dt.getDate();
	        		html.push(String.format("<div>%H<div>%s</div></div>",
        				dt.getHours(), prev !== day ? (dt.getMonth() + 1)
        						+ "/" + day: "&nbsp;"));
	        		prev = day;
        			dt.setTime(dt.getTime() + 1000 * 60 * 60);
        		}
    		} else if(mode === "days") {
    			dt.setYear(year + 5);
    			dt.setMonth(month - 6);
    			this.setVar("min-date", new Date(dt.getTime()));

           		while(dt.getTime() < today.getTime()) {
        			var month = dt.getMonth();
	        		html.push(String.format("<div>%H<div>%s</div></div>",
	        				dt.getDate(), days[(dt.getDay() + 6) % 7]));
        			dt.setTime(dt.getTime() + DAY);
        		}
        	} else if(mode === "weeks") {
    			dt.setYear(year + 4);
        		// round to begin of week
        		dt.setDate(dt.getDate() - (dt.getDay() || 7) + 1);
    			this.setVar("min-date", new Date(dt.getTime()));

        		while(dt.getTime() < today.getTime()) {
        			var month = dt.getMonth();
//	        		html.push(String.format("<div>%H<div>%s</div></div>",
//        				dt.getWeekNumber() + 1, prev !== month ?
//        						months[month] : "&nbsp;"));
	        		html.push(String.format("<div>%H<div>%s</div></div>",
        				dt.getWeekNumber(),
        				String.format("%d %s", dt.getDate(), months[month])));
	        		prev = month;
        			dt.setTime(dt.getTime() + 7 * DAY);
        		}
        	} else if(mode === "months") {
	        	for(var i = -5 * 12; i < 1; ++i, ++month) {
	        		if(month === 12) {
	        			month = 0;
	        			year++;
	        		}
	        		html.push(String.format("<div>%H<div>%s</div></div>",
	        				months[month % 12],
	        				prev != year ? year : "&nbsp;"));
	        		prev = year;
	        	}

        	}

    		if(mode === "hours") {
    			this.addClass("hours");
    		} else {
    			this.removeClass("hours");
    		}

        	this.setContent(String.format(
        		"<div class='bar'>%s</div>" +
        		"<div class='selection'></div>",
        			html.join("")));
        },

        /**
         *
         */
        onResize: function() {
        	if(this.isEnabled() === false) {
        		return;
        	}

			var HE = require("cavalion.org/util/HtmlElement");

			var bar = this.getChildNode(0);
			var selection = this.getChildNode(1);
			var cs = HE.getComputedStyle(selection);
			var margin = parseInt(cs['margin-left'], 10);
			var width = parseInt(cs.width, 10);
			var today = new Date();
			var n_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var min;
			var mode = this.getVar("mode");
			var dt = this.getVar("end");
			var dt_max = this.getVar("max-date");
			var w = 35, n, pos;

			if(dt === undefined) {
				dt = dt_max;
			}

			if(mode === "hours") {
				min = -(bar.scrollWidth - margin) + (width + 25) -
						(today.getMinutes() / 60) * 25;
				w = 25;
				n = (dt_max.getTime() - dt.getTime()) / (1000 * 60 * 60);
				pos = min + n * w;
			} else if(mode === "days") {
				min = -(bar.scrollWidth - margin) + (width + 35) -
						(today.getHours() / 24) * 35;
				n = (dt_max.getTime() - dt.getTime()) / (1000 * 60 * 60 * 24);
				pos = min + n * w;
			} else if(mode === "weeks") {
				min = -(bar.scrollWidth - margin) + (width + 35) -
						(today.getDay() / 7) * 35;
				n = (dt_max.getTime() - dt.getTime()) / (1000 * 60 * 60 * 24 * 7);
				pos = min + n * w;
			} else if(mode === "months") {
				min = -(bar.scrollWidth - margin) + (width + 35) -
						(today.getDate() / n_days[today.getMonth()]) * 35;
				n = dt_max.getFullYear() * 12 + dt_max.getMonth();
				n -= dt.getFullYear() * 12;
				n -= dt.getMonth();
				pos = min + n * w;
			}
			this.setVar("min", min);
			this.setVar("max", margin);
			this.setVar("width", width);

    		this._owner.applyVar("scrollTo",
    				[this, this.getChildNode(0), pos]);
        },

        /**
         *
         */
        onTransitionEnd: function() {
//        	this.setEnabled(true);
        	this.removeClass("animate");
        }
    }),

    $("vcl/ui/Panel", "chart", {
        align: "client",
        content: "<canvas />",
        css: {
            overflow: "hidden"
        },

        onRender: function () {
            var data = this.getVar("data");
            var chart = this.getVar("chart");

            if (chart !== undefined) {
                chart.destroy();
            }

            if (data === undefined) {
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

        onResize: function () {
            this.setTimeout("render", 200);
        }
    })

]);