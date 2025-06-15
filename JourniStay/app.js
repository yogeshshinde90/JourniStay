const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const port = 8080;
const Listing = require("./models/listings");
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));




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

//root route
app.get("/",(req,res) => {
    res.send("route is working");
})

//index route

app.get("/listings" , async (req,res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs",{alllistings});
    
});

//new route
app.get("/listings/new",  (req,res) => {
    res.render("listings/new.ejs")
});

//show route
app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
  const listing =  await  Listing.findById(id);
  res.render("listings/show.ejs",{listing});
});


//create route
app.post("/listings",async (req,res) => {
   const newlisting = new Listing(req.body.listing);
   await newlisting.save();
   res.redirect("/listings")
});


app.listen(port,() => {
    console.log("server is running");
})