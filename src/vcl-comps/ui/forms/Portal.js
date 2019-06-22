$([], {}, [
    $i("title", {
        content: "Vaemon: Energy Monitoring",
        onClick: function(evt) {
        	if(evt.ctrlKey === false) {
	            var el = document.documentElement;
	            var rfs = el.requestFullScreen || el.webkitRequestFullScreen
	                        || el.mozRequestFullScreen;
	            rfs.call(el);
        	} else {
        		return this.inherited(arguments);
        	}
        }
    }),
    $i("title_username", {
    	content: Vaemon.user
    }),
    $i("title_workspace", {
    	content: Vaemon.customer
    }),
    $i("title_location", {
    	content: "<img src='/shared/vcl/images/loading.gif'>"
    }),
    $i("title_signout", {
    	onClick: function() {
    		if(confirm("Are you sure you want to sign out?") === true ) {
    			window.location = "signout";
    		}
    	}
    })
]);