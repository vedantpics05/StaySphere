require("dotenv").config();//Access ENV file
console.log(process.env.ATLASDB_URL);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbURL = process.env.ATLASDB_URL;



const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");


// main().then(()=>console.log("connected to db"))
// .catch((err)=>console.log(err))

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


///Connect mongooo 
const store =  MongoStore.create({
     mongoUrl:dbURL,
     crypto:{
        secret:process.env.SECRET
     },
     touchAfter: 24* 3600,///to validate the user for 24 hrs
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO session store",err)
});

////To access the sessions 
const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",         
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
    }
}


// app.get("/",(req,res)=>{
//     res.send("Home page")
// })

app.set("trust proxy", 1);


app.use(session(sessionOption));
app.use(flash());

//Use of Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

///Use to use flash in many other ejs filess---------Local Middleware ----------------
app.use((req,res,next)=>{
    res.locals.success = req.flash("success"); ///error of success
    res.locals.error = req.flash("error"); ///Flash of error
    res.locals.currUser = req.user; ///Store the user when loggin
    next();
});///------------------------------------------------------------------------------


async function main() {
    try {
        await mongoose.connect(dbURL);
        console.log("connected to db");

        // app.listen(8011, () => {
        //     console.log("Server is Running");
        // });

        const PORT = process.env.PORT || 8011;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        } catch (err) {
            console.log(err);
        }
}

main();
// async function main() {
//     await mongoose.connect(dbURL);
// }

// main().then(()=>console.log("connected to db"))
// .catch((err)=>console.log(err))

// app.listen(8011,()=>{
//     console.log("Server is Running")
// });

// main().then(()=>console.log("connected to db"))
// .catch((err)=>console.log(err))

//Routess Shiftsss -----------------------------------------------------
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews",reviewRoutes)
app.use("/",userRoutes);
app.use("/", (req, res)=>{
    res.redirect("/listings");
})

//-----------------------------------------------------------------------

app.use( (req, res, next) => {
    next(new ExpressError(404, "Page not Found"));
});


//Error Handling
app.use((err,req,res,next)=>{
    let {status=500,message="Somthing went wrong"} = err;
    res.render("error.ejs",{message})
});

