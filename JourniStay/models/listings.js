const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        
    },
    price:{
        type : Number,
    
    },
    location : {
        type : String,
        required : true,
    },
   
    image : {
        filename : String,
        url : String
    },

    country : {
        type : String,
        
    }


});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;