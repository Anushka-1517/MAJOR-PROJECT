const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

// ======================
// MongoDB Connection
// ======================

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// ======================
// View Engine Setup
// ======================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ======================
// Middlewares
// ======================

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ======================
// Routes
// ======================

// Root Route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

const validateListing = (req,res,next) =>{
let {error} = listingSchema.validate(req.body);
 if(error){
  let errMsg =error.details.map((el) => el.message).join(",");
  throw new ExpressError(400,errMsg);
 }else{
  next();
 }
};

const validateReview = (req,res,next) =>{
let {error} = reviewSchema.validate(req.body);
 if(error){
  let errMsg =error.details.map((el) => el.message).join(",");
  throw new ExpressError(400,errMsg);
 }else{
  next();
 }
};

//index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");

  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }

  res.render("listings/show.ejs", { listing });
}));

// Create Route
app.post("/listings",validateListing, wrapAsync(async (req, res) => {
 
  const newListing = new Listing(req.body.listing);
  
  await newListing.save();
  res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }

  res.render("listings/edit.ejs", { listing });
}));

// Update Route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
  
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));
//Reviews
//post review route
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req, res) => {
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);


listing.reviews.push(newReview);

await newReview.save();
await listing.save();


res.redirect(`/listings/${listing._id}`);

}));

//DELETE review ROUTE
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req, res) =>{
let{id,reviewId} = req.params;

await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
res.redirect(`/listings/${id}`);
})
);

// ======================
// 404 Handler (Express 5 compatible)
// ======================

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ======================
// Error Handling Middleware
// ======================

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});

// ======================
// Server
// ======================

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
