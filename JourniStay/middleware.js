const Listing = require("./models/listings");
const { listingSchema ,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const wrapasync = require("./utils/wrapasync");
const Review = require("./models/review");


module.exports.validatereview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(".");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwnwer = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
   if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
    }
    next();

};

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(".");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
   if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
    }
    next();

};



