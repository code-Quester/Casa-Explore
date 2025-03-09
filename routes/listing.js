const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const isloggedin = require("../middleware").isloggedin;
const {isOwner} = require("../middleware");
const {validateListing} = require("../middleware");


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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
}));
//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    })
    .populate("owner");//nested populate
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}))
//edit route
router.get("/:id/edit",isloggedin, isOwner, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}))
router.put("/:id/edit",isloggedin, isOwner, validateListing, wrapAsync(async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}))
//delete route
router.delete("/:id/delete",isloggedin, isOwner, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}))

module.exports = router;