const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image : {
     url: String,
     filename:String
    },
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
