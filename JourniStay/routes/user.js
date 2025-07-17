const express = require("express");
const wrapasync = require("../utils/wrapasync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user");


router
.route("/signup")
.get((req,res) => {
    res.render("users/signup.ejs")})
. post(wrapasync(userController.signUp))


router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/login", failureFlash:true}),userController.login);


router.get("/logout", userController.logout);
module.exports = router;