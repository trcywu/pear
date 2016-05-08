var mongoose	= require("mongoose");
var bcrypt		= require("bcrypt-nodejs");
var validator = require("validator");

var userSchema = new mongoose.Schema({
	firstName: 		{ type: String },
	lastName: 		{ type: String },
	image: 				{ type: String },

	username: 		{ type: String, required: true, unique: true },
	email: 				{ type: String, required: true, unique: true },
	passwordHash: { type: String }
}, {
	timestamps: 	true
});

userSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.passwordHash, null);
}

userSchema.virtual("password")
.set(function(password) {
	this._password = password;
	this.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
});

userSchema.virtual("passwordConfirmation")
.set(function(passwordConfirmation) {
	this._passwordConfirmation = passwordConfirmation;
});

userSchema.path("passwordHash")
.validate(function() {
	if (!this._password) {
		this.invalidate("password", "Password is required");
	}
	if (this.password.length <= 8) {
		this.invalidate("password", "Password must be 8 characters or more");
	}
	if (this._password !== this._passwordConfirmation) {
		this.invalidate("passwordConfirmation", "The password and password confirmation must match");
	}
});

userSchema.path("email")
.validate(function(email) {
	if (!validator.isEmail(email)) {
		this.invalidate("email", "Please use a valid email address");
	}
});

userSchema.set("toJSON", {
	transform: function(doc, ret, options) {
		delete ret.passwordHash;
		return ret;
	}
});

module.exports = mongoose.model("User", userSchema);