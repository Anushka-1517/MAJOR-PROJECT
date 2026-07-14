const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
require("dotenv").config();

const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAP_TOKEN,
});
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

 const initDB = async () => {
  await Listing.deleteMany({});

  let listings = [];

  for (let obj of initData.data) {
    let response = await geocodingClient
      .forwardGeocode({
        query: `${obj.location}, ${obj.country}`,
        limit: 1,
      })
      .send();

    obj.owner = "6a467ac852a569dc9a60a8e5";
    obj.geometry = response.body.features[0].geometry;

    listings.push(obj);
  }

  await Listing.insertMany(listings);
  console.log("Data was initialized");
};

main()
  .then(() => initDB())
  .catch((err) => console.log(err));