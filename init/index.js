<<<<<<< HEAD
<<<<<<< HEAD
const mongoose =require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(() =>{
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

}
=======
const mongoose =require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(() =>{
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

}
>>>>>>> 659fb60e7f861703ffc8199576ced08a2b41ba5e
=======
const mongoose =require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(() =>{
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

}
>>>>>>> 659fb60e7f861703ffc8199576ced08a2b41ba5e
initDB();