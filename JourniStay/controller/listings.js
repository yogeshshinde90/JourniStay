const Listing = require("../models/listings")

module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm =   (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing({ ...req.body.listing });
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}

module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path :"reviews", populate:{path:"author",}}).populate("owner");
    if (!listing) {
     req.flash("error", "You are not the owner of this listing");
    res.redirect("/listings");
    }else{
    res.render("listings/show.ejs", { listing });
   }
}

module.exports.editlistings = async (req, res) => {
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

    
};

module.exports.updatelistings = async (req, res) => {
    
    let { id } = req.params;
    let listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroylistings = async (req, res) => {
    const { id } = req.params;
   let deletelisting = await Listing.findByIdAndDelete(id);
   console.log(deletelisting);
    req.flash("success", " Listing deleted!");
    res.redirect("/listings");
}