const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
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

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((listing)=>({...listing,owner:"67bffd10965787187d8f008a"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();