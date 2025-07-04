const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listings");
const wrapasync = require("../utils/wrapasync.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(".");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


// Index
router.get("/", wrapasync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}));

// New
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create
router.post("/",validateListing, wrapasync(async (req, res) => {
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(404,result.error);
    }
    console.log("Validation result:", result); 
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
}));

// Show
router.get("/:id", wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
     throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show.ejs", { listing });
}));

// Edit
router.get("/:id/edit", wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(" Listing for edit route:", listing); 
    if (!listing){
     throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update
router.put("/:id",validateListing, wrapasync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(404,"send valid data for listing");
    }
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    res.redirect("/listings");
}));




// Delete
router.delete("/:id",
     wrapasync(async (req, res) => {
    const { id } = req.params;
   let deletelisting = await Listing.findByIdAndDelete(id);
   console.log(deletelisting);
    res.redirect("/listings");
}));


module.exports = router;