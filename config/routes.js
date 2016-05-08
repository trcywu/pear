var express = require("express");
var router	= express.Router();

var usersController						= require("../controllers/usersController");
var authenticationsController = require("../controllers/authenticationsController");

router.post("/login", authenticationsController.login);
router.post("/register", authenticationsController.register);

router.route("/users")
.get(usersController.index);

router.route("/users/:id")
.get(usersController.show)
.put(usersController.update)
.patch(usersController.update)
.delete(usersController.delete);

module.exports = router;