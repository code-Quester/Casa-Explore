const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
router.get("/signup",(req,res)=>{
    res.render("../views/users/signup");
})
router.post("/signup",wrapAsync(async(req,res,next)=>{
    try{
        const {email,username,password} = req.body;
        const user = new User({username,email});
        const registeredUser = await User.register(user,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to CasaExplore");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))
router.get("/login",(req,res)=>{
    res.render("../views/users/login");
})
router.post("/login",saveRedirectUrl,(req,res,next) =>{console.log("Login attempt: ",req.body);next();},passport.authenticate("local",{ failureRedirect: '/login' ,failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
})
module.exports = router;