


const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const app = express();
const port = 8080;

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

// Root route
app.get("/", (req, res) => {
    res.send("Route is working");
});

// Test route to create a sample listing
app.get("/testlisting", async (req, res) => {
    try {
        const sampleListing = new Listing({
            title: "My New Villa",
            description: "By the Beach",
            price: 1200,
            image: "default image",
            location: "Calangute, Goa",
            country: "India",
        });

        await sampleListing.save();
        console.log("Successfully saved listing.");
        res.send("Successfully saved listing.");
    } catch (error) {
        console.error("Error saving listing:", error);
        res.status(500).send("Failed to save listing");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
