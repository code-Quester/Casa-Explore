const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {reviewSchema} = require("../schema");
const Listing = require("../models/listing");
const Review = require("../models/review");
const {isloggedin} = require("../middleware");

const validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

router.post("/",isloggedin, validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview.author);
    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();

    console.log("new review saved");
    req.flash("success","New review added!");
    res.redirect(`/listings/${listing._id}`);
}))
//delete review route
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let{id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser.id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted")
    res.redirect(`/listings/${id}`)
}))

module.exports = router;