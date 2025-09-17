const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router.route("/")
//index route
.get( wrapAsync(listingController.index))
//create route
.post(isLoggedIn, validateListing, wrapAsync(listingController.creatListing));

// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
// Show Route
.get( wrapAsync(listingController.showListing))
// Update Route
.put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))
// Delete Route
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;