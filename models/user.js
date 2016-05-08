var mongoose	= require("mongoose");
var bcrypt		= require("bcrypt-nodejs");

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

module.exports = mongoose.model("User", userSchema);