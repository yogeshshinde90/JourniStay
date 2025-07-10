const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listings");
const wrapasync = require("../utils/wrapasync.js");
const user = require("../models/user.js");
const { isLoggedIn, isOwnwer,validateListing } = require("../middleware.js");
const currUser = require("../models/user.js");




// Index
router.get("/", wrapasync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}));

// New
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Create
router.post("/",validateListing,isLoggedIn, wrapasync(async (req, res) => {
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(404,result.error);
    }
    console.log("Validation result:", result); 
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}));

// Show
router.get("/:id",isLoggedIn, wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
     req.flash("error", "You are not the owner of this listing");
    res.redirect("/listings");
    }else{
    res.render("listings/show.ejs", { listing });
   }
}));

// Edit
router.get("/:id/edit", isLoggedIn,isOwnwer, wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(" Listing for edit route:", listing); 
     req.flash("success", "Listing Edited successfully!");
    if (!listing) {
     req.flash("error", "Listing you requested for does not exists");
    res.redirect("/listings");
    }else{
    res.render("listings/edit.ejs", { listing });
    }

    
}));

// Update
router.put("/:id",isLoggedIn,isOwnwer,validateListing, wrapasync(async (req, res) => {
    
    let { id } = req.params;
    let listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));




// Delete
router.delete("/:id",isLoggedIn,isOwnwer,
     wrapasync(async (req, res) => {
    const { id } = req.params;
   let deletelisting = await Listing.findByIdAndDelete(id);
   console.log(deletelisting);
    req.flash("success", " Listing deleted!");
    res.redirect("/listings");
}));


module.exports = router;