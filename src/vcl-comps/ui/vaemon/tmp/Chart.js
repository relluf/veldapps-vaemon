$(["ui/forms/View"], {
    css: {
        "&:not(.loaded) [id$=\"-host\"]": {
        	"background": "url(/shared/vcl/images/loading.gif) no-repeat"
        }
    }
}, [


    $i("client", {
    	css: {
    		padding: "20px"
    	}
    }, [
    	$("vcl/ui/Panel", "host", {
    		align: "client"
    	})
    ])

]);