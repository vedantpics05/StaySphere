const { findById } = require("./models/user");
const Listing = require("./models/listing"); // adjust path if needed
const Review = require("./models/reviews");
const reviews = require("./models/reviews");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");



module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;//store orignalurl in redirecturl
        req.flash("error","You must be logged in to create a listing!!");
        return res.redirect("/login")
    }
    return next();
}

module.exports.saveRedirect = (req,res,next)=>{///used to redirect the page we are on any page
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//--------------------------Validate listing-------------------------------------
module.exports.validateListing = (req,res,next)=>{
  // make sure categories is ALWAYS an array
  if (req.body.listing && typeof req.body.listing.categories === "string") {
    req.body.listing.categories = req.body.listing.categories
      .split(",")
      .filter(Boolean);
  }

    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
};


///To check the same owner for edit and delete of post is same or not
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

//Review Authariseation - Only Owner can delete the review(add this in delete command)
module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewId,id } = req.params;
  let review = await Review.findById(reviewId);

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Owner of the Review!!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

