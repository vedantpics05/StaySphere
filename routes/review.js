const express = require("express");
const router = express.Router({ mergeParams: true });


const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing= require("../models/listing");
const {isLoggedIn, isReviewAuthor}= require("../middleware.js");

const ReviewController = require("../controllers/reviews.js")

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}


//Review Route
//Post Route
router.post("/",
    isLoggedIn
    ,validateReview,
     wrapAsync (ReviewController.CreateReview));

//Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(ReviewController.Delete));

module.exports = router