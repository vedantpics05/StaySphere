const mongoose =require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

main().then(()=>console.log("connected to db"))
.catch((err)=>console.log(err))

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async ()=>{
    await Listing.deleteMany({});////To delete the listings
     initData.data = initData.data.map((obj)=>
        ({...obj, owner:'6967a1b04036d7adac80f368'
      }))///Add owner in data
    await Listing.insertMany(initData.data);
    console.log("Data was runn")
}

initDB();