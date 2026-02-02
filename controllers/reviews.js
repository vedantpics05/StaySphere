const Listing = require("../models/listing");
const Review = require("../models/reviews")


//--------Create a Review----------------------------
module.exports.CreateReview =async(req,res) =>{
    console.log(req.params.id);

    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; ///Author to showw

    console.log(newReview)
    listing.reviews.push(newReview._id);

    await newReview.save();

    await listing.save();
    req.flash("success","New Review Created!!");
    res.redirect(`/listings/${listing._id}`);
};

//---------Delete---------
module.exports.Delete = async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!!");
    res.redirect(`/listings/${id}`);
};