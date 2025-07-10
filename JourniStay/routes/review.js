const express = require("express");
const router = express.Router({mergeParams : true});
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review");
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listings");
const {validatereview}= require("../middleware.js");


router.post("/",validatereview,wrapasync( async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
     req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
}));


//delete review

router.delete("/:reviewId", wrapasync(async (req, res) => {
    const {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Review Deleted");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;

