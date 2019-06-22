$(["ui/Form"], {

    "@require": ["chartjs.org/Chart"],

    css: {
        padding: "20px"
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

        RenderLabel: {
            years: function (tuple) {
                this.labels.push(tuple[0]);
                this.datasets[0].data.push(tuple[1]);
            },
            months: function (tuple) {
                var months = ("January,February,March,April,May,June,July," +
                    "August,September,October,November,December").split(",");
                    
                this.labels.push(months[tuple[1]]);
                this.datasets[0].data.push(tuple[2]);
            },
            weeks: function (tuple) {
                this.labels.push(String.format("Week %d", tuple[1]));
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

        request: function () {
            var Command = require("cavalion.org/Command");
            var RenderLabel = this.getVar("RenderLabel");

            var scope = this.getScope();
            var day = 24 * 60 * 60 * 1000;
            var type = scope.type.getValue().toLowerCase();
            var req = {
                channel: this.getParam("instance").getKey()
            };

            req.end = new Date(scope.end._node.valueAsDate.getTime());
            req.end.setTime(parseInt(req.end.getTime() / day, 10) * day + day);

            Command.execute("rest/charts/" + type, req).addCallback(function (tuples) {
                var data = {
                    labels: [],
                    datasets: [{
                        label: "My First dataset",
                        fillColor: "rgba(254,127,64,1)",
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: []
                    }]
                };

                tuples.forEach(RenderLabel[type].bind(data));

                scope.chart.setVar("data", data);
                scope.chart.render();
            });
        }
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
        $("vcl/ui/Select", "type", {
            css: {
                font: "inherit"
            },
            options: "Years,Months,Weeks,Days,Hours".split(","),
            onLoad: function () {
                this.setValue("Weeks");
            },
            onChange: function () {
                this._owner.applyVar("request", []);
            }
        }),
        $("vcl/ui/Element", {
            element: "span",
            content: "&nbsp;End Date: "
        }),
        $("vcl/ui/Input", "end", {
            css: {
                font: "inherit"
            },
            onNodeCreated: function () {
                this._node.valueAsDate = new Date();
            },
            onChange: function () {
                this._owner.applyVar("request", []);
            },
            type: "date"
        })
    ]),

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