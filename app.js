const express = require("express");
const mongoose = require("mongoose");
const app = express();
exports.app = app;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listing.js"); 
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
main()
    .then(()=>{
        console.log("connection successful");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/casaexplore");
}

const sessionOptions = {
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    }
};

app.get("/",(req,res)=>{
    res.send("Hi this is root");
})
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// app.get("/testListing",async(req,res)=>{
//     let sampleListing =  new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })

app.use("/listings",listingRouter);  //IMPORTANT
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//middlewares
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"} = err;
    res.status(status).render("error.ejs",{message});
})
//server
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
})




