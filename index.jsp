<%@ page import="javax.persistence.EntityManager" %>
<%@ page import="com.veldapps.entities.EM" %>
<%@ page import="com.veldapps.App" %>
<%@ page import="com.veldapps.vaemon.entities.Customer" %>
<%
	boolean debug = request.getParameterMap().containsKey("debug");

	if(session.getAttribute("user") == null) {
		session.setAttribute("debug", debug);
		response.sendRedirect("signin");
	} else {
		if(!debug && Boolean.TRUE.equals(session.getAttribute("debug")) ||
		   (debug && !Boolean.TRUE.equals(session.getAttribute("debug")))) {
			session.setAttribute("debug", debug);
			response.sendRedirect("?debug");
		} else {
			String main = debug ? "main" : "lib";
			String build = debug ? "0" : "2";
%>
<html>
	<head>
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
		<style>* { box-sizing: border-box;}</style>
		<script type="text/javascript">
		    var require = {
		        waitSeconds: 0,
		        urlArgs: "v13"
		    };
			var Vaemon = {
				build: "<%= build %>",
				user: "<%= session.getAttribute("user") %>",
				customer: "Stiho Utrecht"
			};
		</script>
		<script type="text/javascript" src="/shared/vcl/lib/requirejs.org/require-2.1.8-debug.js" data-main="src/<%= main %>.js"></script>
	</head>
	<body><img src="/shared/vcl/images/loading.gif"></body>
</html>
<%
		}
	}
%>
