var LocalStrategy = require("passport-local").Strategy;
var User					= require("../models/user");

module.exports = function(passport) {
	passport.use("local-signup", new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
		session: false
	}, function(req, email, password, done){
		User.findOne({ 'email': email }, function(err, user){
			if (err) return done(err, false, { message: 'Something went wrong'});
			if (user) return done(null, false, { message: 'Please choose another email' });

			var newUser = new User({
				firstName: req.body.firstName,
				lastName:  req.body.lastName,
				image:     req.body.image,
				username:  req.body.username,
				email:     req.body.email,
				password:  req.body.password,
				passwordConfirmation: req.body.passwordConfirmation
			});

			newUser.save(function(err, user){
				if (err) return done(err, false, { message: "Something went wrong" })
					return done(null, user);
			});
		});
	}));
}