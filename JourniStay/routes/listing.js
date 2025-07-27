const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings");
const wrapasync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwnwer,validateListing } = require("../middleware.js");
const listingController = require("../controller/listings");
const multer = require("multer");
const {storage} = require("../cloudConfig.js") ;
const upload = multer({ storage });



// Index

router
.route("/")
.get( wrapasync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapasync(listingController.createNewListing))


router.get("/new", isLoggedIn, listingController.renderNewForm);


// Show
router
.route("/:id")
.get(isLoggedIn, wrapasync(listingController.showListings))
.put(isLoggedIn,isOwnwer,isOwnwer,upload.single("listing[image]"),validateListing, wrapasync(listingController.updatelistings))
.delete(isLoggedIn,isOwnwer,
     wrapasync(listingController.destroylistings));


// Edit
router.get("/:id/edit", isLoggedIn,validateListing, wrapasync(listingController.editlistings));


module.exports = router;