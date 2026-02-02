const User = require("../models/user")


module.exports.RenderSignUpForm =async (req,res)=>{
    res.render("users/signup.ejs")
};

module.exports.SignUp = async (req,res,next)=>{
    try{
        let {username,password,email} =req.body;
    let newUser = new User({username,email});
    const user =  await User.register(newUser,password);
    console.log(user);

    req.login(user,(err)=>{///Automatically Login when sign up using re.login(err)
        if(err){
            next(err);
        }
         req.flash("success","Welcome to StaySphere!!")
         res.redirect("/listings");
    })

    }catch(e){
        req.flash("error","This user is already registered")
        res.redirect("/signup");
    }
};

module.exports.RenderLoginForm =(req,res)=>{
    res.render("users/login.ejs")
};

//After Successfull Login
module.exports.Login = async(req,res)=>{
        req.flash("success","Welcome to StaySphere");
        //For redirection
        let redirectUrl = req.session.redirectUrl || "/listings";
        delete req.session.redirectUrl; // VERY IMPORTANT
        res.redirect(redirectUrl);
};

module.exports.Logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","You are logged out!! ");
        res.redirect("/listings")
    })
}