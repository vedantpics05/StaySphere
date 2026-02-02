const Listing = require("../models/listing")
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const axios = require("axios");



//----------Index Route-------------------------
// module.exports.index = async (req,res)=>{
//     const allListing = await Listing.find({});
//     res.render("listings/index",{allListing});
// };
//----------Index Route-------------------------Explain this laterrr 
module.exports.index = async (req, res) => {

  const category = req.query.category;
  const search = req.query.search;

  let query = {};   // empty filter = show all

  // 🔍 SEARCH (by city)
  if (search) {
    query.location = new RegExp(search, "i");//RegExp = ignore letters and search what is type not spific

  }

  // 🏷 CATEGORY
  if (category) {
    query.categories = { $in: [category] };
  }

  const allListing = await Listing.find(query);

  res.render("listings/index", {
    allListing,
    activeCategory: category
  });
};



//----------New Form--------------------------
module.exports.renderNewForm =(req, res) => {
  res.render("listings/new");
};

//Show Route
module.exports.showLisiting = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
  .populate({path: "reviews",populate:{path:"author"}})//To show author in review
  .populate("owner");

  if (!listing) {
    req.flash("error","Lisitng does not Exist");
    return res.redirect("/listings");
  }

 // 🔑 other listings from SAME CITY (exclude current one)
 const cityListings = await Listing.find({
 location: listing.location,
 _id: { $ne: listing._id }
 });

//   console.log(listing);
  res.render("listings/show", { listing,cityListings });
}

//Create Post
module.exports.CreatePost =async (req,res,next)=>{
  console.log("✅ CREATE POST HIT");/////////////////////////

     const listingData = req.body.listing;
     //Step 2 -Validate After fxing shape
    // let result = listingSchema.validate({ listing: listingData });
    // if(result.error){
    //     throw new ExpressError(400,result.error)
    // }

   // 🔍 get coordinates
    const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${listingData.location},${listingData.country}&format=json`
    );

    const newListing = new Listing(listingData);


    ////Save the image
    if (req.file) { 
    newListing.image = {
    url: req.file.path,
    filename: req.file.filename
    };
    }
    
  // ✅ real location
  newListing.geometry = {
    type: "Point",
    coordinates: [
      response.data[0].lon,
      response.data[0].lat
    ]
  };

  // image
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  newListing.owner = req.user._id;
  await newListing.save();



    req.flash("success","New Listing Created!!");
    res.redirect("/listings");

    

};

//Edit - the existing data
module.exports.EditForm =async (req,res)=>{
    let {id} =req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
    }

    let originaImage = listing.image.url;//Image showing in edit form
    originaImage =  originaImage.replace("/upload","/upload/,w_250");
    res.render("listings/edit",{listing,originaImage})
};

//Update 
module.exports.Update = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(
        id,{ ...req.body.listing },{ new: true });
    
    if(req.file){///Used if to check if image is uploaded for not
    let url = req.file.path;///To save the imagee
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }

    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
};

//Delete
module.exports.Delete = async(req,res)=>{
    let {id}=req.params;
    let deleted = await Listing.findByIdAndDelete(id)
    console.log(deleted);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings")
};
