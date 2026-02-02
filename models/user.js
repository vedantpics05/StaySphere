// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema  = new Schema({
//     email:{type:String,required:true},
// });

// userSchema.plugin(passportLocalMongoose);

// const User = mongoose.model("User", userSchema);
// module.exports = User;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Fix for Node 22 export issue
const plm = require("passport-local-mongoose");
const passportLocalMongoose = typeof plm === "function" ? plm : plm.default;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

// Apply plugin to schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
