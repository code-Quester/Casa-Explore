const express = require("express");
const app = express();
const session = require("express-session");

const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(cookieParser("secretcode"));

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hola i am the root");
// })
// app.get("/greet",(req,res)=>{
//     let{name="anonymous"} = req.cookies;
//     res.send(`Hi ${name}`);
// })
// app.get("/getsignedcookies",(req,res)=>{
//     res.cookie("color","blue",{signed:true});
//     res.send("signed cookie send");
// })
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madeIn","India");
//     res.cookie("name","niloy");
//     res.send("sent you some cookies!");
// })

app.use(session({secret:"secretcode"}));
app.use(flash());

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count ++;
    }else{
        req.session.count =1;
    }
    res.send(`you send a request ${req.session.count} times`);
})
app.get("/register",(req,res)=>{
    let {name = 'anonymous'} = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully");
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.locals.msg = req.flash("success");
    res.render("page.ejs",{name:req.session.name});
})
// app.get("/test",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("test successful");
// })

app.listen(3000,()=>{
    console.log("server is listening on 3000");
})