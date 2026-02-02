const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema =  new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename: String,
        url: String
        // type:String,
        // required:true,
        // set:(v) => v === "" ? "https://unsplash.com/photos/a-tree-in-a-lake-x6EyvkhT9ZU":v
    },
    price:Number,
    location:String,
    country:String, geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },categories:{///Implement by your self
        type:[String],
        enum:[ "trending",
        "rooms",
        "iconic-cities",
        "pools",
        "camping",
        "farms",
        "metro",
        "domes",
        "5-star"],
    }
});

///To delete all the reviews when we delete listing from an hotel
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;