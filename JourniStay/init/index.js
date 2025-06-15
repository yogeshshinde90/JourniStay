const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listings.js");

async function main() {
    await mongoose.connect("mongodb://localhost:27017/JourniStay");
}

main()
.then(() => {
    console.log("connected to database");
})
.catch(err=> {
    console.error("error connecting to database",err);
})


const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was initialize");
}

initDB();