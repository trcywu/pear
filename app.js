var config					= require("./config/config");
var express					= require("express");
var app							= express();
var morgan					= require("morgan");
var methodOverride	= require("method-override");
var bodyParser			= require("body-parser");
var mongoose				= require("mongoose");
var passport				= require("passport");

mongoose.connect(config.database);

require("./config/passport")(pasport);

app.use(morgan("dev"));

app.use(methodOverride(function(res, req) {
	if (req.body && typeof req.body === "object" && "_method" in req.body) {
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(config.port, function() {
	console.log("Express is running on port ", config.port);
});