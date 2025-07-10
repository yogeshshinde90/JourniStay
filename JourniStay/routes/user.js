const express = require("express");
const wrapasync = require("../utils/wrapasync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup",wrapasync(async(req,res) => {
    try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err){
            return next(err);
        }
    
    req.flash("success","Welcome to JourniStay");
    res.redirect("/listings");
    });
    }catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}));


router.get("/login" ,async(req,res) => {
     res.render("users/login.ejs")
})

router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/login", failureFlash:true}), async(req,res) => {
    req.flash("success","Welcome to JourniStay");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});


router.get("/logout", (req,res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    })
})
module.exports = router;