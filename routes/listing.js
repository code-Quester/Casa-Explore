const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema");
const Listing = require("../models/listing");
const isloggedin = require("../middleware").isloggedin;
const validateListing = (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

router.get("/",wrapAsync(async(req,res)=>{
    const listings = await Listing.find({});
    res.render("listings/index.ejs",{listings});
}))
//create route
router.get("/new",isloggedin,(req,res)=>{
    res.render("listings/new.ejs")
})

router.post("/",isloggedin,validateListing, wrapAsync(async(req,res,next)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
}));
//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}))
//edit route
router.get("/:id/edit",isloggedin,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}))
router.put("/:id/edit",isloggedin,validateListing, wrapAsync(async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}))
//delete route
router.delete("/:id/delete",isloggedin,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}))

module.exports = router;