const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// -------------------- Validation Middleware --------------------
const validateListing = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// post
router.post("/", validateListing, wrapAsync(async (req, res) => {
  console.log("POST /reviews hit, id:", req.params.id);
  let listing = await Listing.findById(req.params.id);
  if (!listing) return res.send("Listing not found!");

  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
   req.flash("success","new review created!");
  res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:reviewID", wrapAsync(async(req,res)=> {
    let {id,reviewId}=req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;