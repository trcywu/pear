var passport	= require("passport");
var User			= require("../models/user");
var secret		= require("../config/config").secret;
var jwt				= require("jsonwebtoken");

function register(req, res, next) {
	var LocalStrategy = passport.authenticate("local-signup", function(err, user, info) {
		if (err) return res.status(500).json(info);
		if (info) return res.status(401).json(info);
		if (!user) return res.status(401).json(info);

		var payload = user._id;
		var token		= jwt.sign(payload, secret, { expiresIn: 60*60*24 });

		return res.status(200).json({
			success: true,
			message: "Thanks for authenticating",
			user: user,
			token: token
		});
	});

	return LocalStrategy(req, res, next);
}

function login(req, res, next) {
	console.log(req.body)
	User.findOne({
		"email": req.body.email
	}, function(err, user) {
		if (err) return res.status(500).json({ message: "Something went wrong" });
		if (!user) return res.status(403).json({ message: "No user detected" });
		if (!user.validatePassword(req.body.password)) return res.status(403).json({ message: "Authentication failed" });

		var payload = user._id;
		var token		= jwt.sign(payload, secret, { expiresIn: 60*60*24 });

		return res.status(200).json({
			success: true,
			message: "Welcome!",
			user: user,
			token: token
		});
	});
}

module.exports = {
	login: login,
	register: register
}
