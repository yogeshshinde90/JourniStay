const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");


// Connect to MongoDB
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonder");
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was initialize");
}

initDB();