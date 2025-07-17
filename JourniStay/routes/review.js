const express = require("express");
const router = express.Router({mergeParams : true});
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review");
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listings");
const { validatereview ,isLoggedIn, isReviewAuthor}= require("../middleware.js");
const reviewController = require("../controller/reviews");


router.post("/",
    isLoggedIn,
    validatereview,
    wrapasync(reviewController.createReview ));


//delete review

router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapasync(reviewController.destroyReview));

module.exports = router;

