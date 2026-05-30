const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("./models/listing.js"); // make sure this path is correct

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

main()
  .then(() => initDB())
  .catch((err) => console.log(err));