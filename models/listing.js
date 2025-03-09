const mongoose = require("mongoose");
const {Schema} = mongoose;
const Review = require("./review.js");
const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename: { type: String},
        url: { 
            type: String,
            default:"https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8dHJhdmVsfGVufDB8fDB8fHww",
            set:(v)=> v===""?"https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8dHJhdmVsfGVufDB8fDB8fHww":v
        },
    },
    price:{
        type:Number
    },
    location:String,
    country: String,
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;