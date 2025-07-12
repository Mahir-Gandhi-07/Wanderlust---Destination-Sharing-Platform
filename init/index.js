const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";

main().then((res)=>{
    console.log("Connection successful!");
}).catch((err)=>{
    console.log(err);
});
async function main(){
await mongoose.connect(MONGOURL);
}

const intidb = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"67fa16ac6e801a362284c3ea"}));
    await Listing.insertMany(initData.data);
    console.log("Data is initialized!");
}
intidb();

