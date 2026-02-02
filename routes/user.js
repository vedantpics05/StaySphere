const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirect} = require("../middleware.js");

const userController = require("../controllers/users.js")


//---------Route.Routes(SignUp)--------
router.route("/signup")
.get( userController.RenderSignUpForm)
.post(wrapAsync(userController.SignUp))



///------Router.Route(Login)-------
router.route("/login")
.get(userController.RenderLoginForm)
.post(
  // saveRedirect,
      passport.authenticate("local",////Passsport authenticator if username pass consist in database or not 
        {failureRedirect:"/login",/// Actuall Login Implementation
        failureFlash:true
        }), 
        userController.Login);



//----------------------------Signup------------------------------------------------
// router.get("/signup", userController.RenderSignUpForm);

// router.post("/signup",wrapAsync(userController.SignUp));


////-----------------------Login------------------------------------------------------- 
// router.get("/login",userController.RenderLoginForm);

// router.post("/login",
//     saveRedirect,
//     passport.authenticate("local",////Passsport authenticator if username pass consist in database or not 
//         {failureRedirect:"/login",/// Actuall Login Implementation
//         failureFlash:true
//         }), 
//         userController.Login);


///-----------------------Logout---------------------------------------------------------
router.get("/logout",userController.Logout)
    
module.exports = router