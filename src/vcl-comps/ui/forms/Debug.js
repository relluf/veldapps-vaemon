$(["ui/forms/View"], {
	caption: "Rapportage"
}, [
    $i("description", {
        content: "<b>Profielen</b> - Rapporteer de veldwerkgegevens in de vorm " +
            "van profielen."
    }),
    
    $i("client", {}, [
        $("vcl/ui/Panel", {
            align: "top",
            autoSize: "height",
            css: {
                "padding-bottom": "6px",
                "a": {
                    "color": "blue",
                    "margin-right": "16px",
                    "padding-left": "18px",
                    "background-position": "0% 50%",
                    "background-repeat": "no-repeat",
                        "text-decoration": "underline",
                    "&:hover": {
                        cursor: "pointer",
                    },
                    "&.update": {
                        "background-image": "url(http://46.243.27.45/redmine/images/edit.png)",
                    },
                    "&.time": {
                        "background-image": "url(http://46.243.27.45/redmine/images/time_add.png)"
                    },
                    "&.star-off": {
                        "background-image": "url(http://46.243.27.45/redmine/images/fav_off.png)"
                    },
                    "&.star-on": {
                        "background-image": "url(http://46.243.27.45/redmine/images/fav_on.png)"
                    },
                    "&.copy": {
                        "background-image": "url(http://46.243.27.45/redmine/images/copy.png)"
                    },
                    "&.delete": {
                        "background-image": "url(http://46.243.27.45/redmine/images/delete.png)"
                    }
                }
            }
        }, [
            $("vcl/ui/Element", {
                element: "a",
                content: "Update",
                classes: "update"
            }),
            $("vcl/ui/Element", {
                element: "a",
                content: "Time",
                classes: "time"
            }),
            $("vcl/ui/Element", {
                element: "a",
                content: "Favorites",
                classes: "star-off"
            }),
            $("vcl/ui/Element", {
                element: "a",
                content: "Copy",
                classes: "copy"
            }),
            $("vcl/ui/Element", {
                element: "a",
                content: "Delete",
                classes: "delete"
            })
        ]),
        $("vcl/ui/Panel", {
            align: "client",
        	css: {
        	    "overflow": "hidden",
        	    "iframe": "position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; border: 1px solid silver;"
        	},
        // 	content: "<iframe src=\"http://eurecaproject.eu/files/5013/9885/7113/example4.pdf\"></iframe>",
        	content: "<iframe src=\"http://localhost/home/ralph/Source/profielen.pdf\"></iframe>",
        	
        	onNodeCreated: function() {
        	    
        	},
        	
        	onResize: function() {
        	    this.render();
        	},
        	
        	onRender: function() {
        	    var cs = this.getComputedStyle();
        	    this._node.childNodes[0].style.width = cs.width;
        	    this._node.childNodes[0].style.height = cs.height;
        	}
        })    
    ])
]);