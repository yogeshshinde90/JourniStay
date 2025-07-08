const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const port = 8080;

// Database connection
async function main() {
    await mongoose.connect("mongodb://localhost:27017/JourniStay");
}
main()
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 1000,
        httpOnly : true,
    },
};
//Root

app.get("/", (req, res) => {
    res.send("✅ Root Route Working");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/demouser", async (req,res) => {
    let fakeuser = new User({
        email:"student@gmail.com",
        username:"delta-student2"
    });

   let registerUser = await   User.register(fakeuser,"helloworld");
   res.send(registerUser);
})

// Routes



app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)
app.use("/",user);



// Index


// 404 Route
app.all("{/*any}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});



// Error Handler
app.use((err, req, res, next) => {
    const { statuscode = 500, message = "Something went wrong" } = err;
    res.status(statuscode).render("error.ejs",{message});
});



// Start server
app.listen(port, () => {
    console.log(` Server is running on http://localhost:${port}`);
});
