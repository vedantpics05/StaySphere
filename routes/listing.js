const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing= require("../models/listing");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");



//---------------------------Controllers-------------------------
const ListingController = require("../controllers/listings.js");

//-------Image Store in Backend
const multer = require("multer");
const {storage} = require("../cloudConfig.js")///Taken from multer and store in
const upload = multer({storage});// multer store the data in strorage


//-----Router.Route-get and post listing-------
router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn, 
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.CreatePost));



//---------NEW route — MUST COME FIRST-------------------------------------
router.get("/new",isLoggedIn , ListingController.renderNewForm);



//-----For Id get update and Delete -----
router.route("/:id")
.get( wrapAsync(ListingController.showLisiting))
.put( isLoggedIn ,isOwner, upload.single("listing[image]"),validateListing,wrapAsync(ListingController.Update))
.delete(isLoggedIn ,isOwner, wrapAsync(ListingController.Delete))




    

// //-----------------------Index Route--------------------
// router.get("/",
//     wrapAsync(ListingController.index));



//---------------------SHOW route — MUST COME AFTER-----------------------------------
// router.get("/:id", wrapAsync(ListingController.showLisiting));



//----------------------CREATE - POST Route-----------------------------------------
// router.post("/",isLoggedIn,validateListing,
//     wrapAsync(ListingController.CreatePost));



//------------------------Edit - the existing data----------------------------------
router.get("/:id/edit",isLoggedIn ,isOwner, wrapAsync(ListingController.EditForm));



//-------------------------UPDATE Route----------------------------------------
// router.put(
//     "/:id",isLoggedIn ,isOwner,validateListing,wrapAsync(ListingController.Update));



//--------------------------DELETE Route----------------------------------------
// router.delete("/:id" ,isLoggedIn ,isOwner, wrapAsync(ListingController.Delete));






module.exports = router;