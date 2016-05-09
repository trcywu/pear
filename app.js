var config					= require("./config/config");
var express					= require("express");
var morgan					= require("morgan");
var methodOverride	= require("method-override");
var bodyParser			= require("body-parser");
var mongoose				= require("mongoose");
var passport				= require("passport");
var expressJWT			= require("express-jwt");
var cors						= require("cors");

var routes					= require("./config/routes");

var app							= express();

// Database
mongoose.connect(config.database);

// Passport
require("./config/passport")(passport);

// Morgan
app.use(morgan("dev"));

// Method-override
app.use(methodOverride(function(res, req) {
	if (req.body && typeof req.body === "object" && "_method" in req.body) {
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}))

// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express-JWT
app.use("/api", expressJWT({ secret: config.secret })
.unless({
	path: [
		{ url: "/api/login", methods: ["POST"] },
		{ url: "/api/register", methods: ["POST"] }
	]
}));

app.use(function(err, req, res, next) {
	if (err.name === "UnauthorizedError") {
		return res.status(401).json({ message: "Unauthorized request" });
	}
	next();
});

// Cors
app.use(cors());

// Routes
app.use("/api", routes);

// Public directory
app.use(express.static(__dirname + "/public"));

app.get("*", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

// Port
app.listen(config.port, function() {
	console.log("Express is running on port ", config.port);
});