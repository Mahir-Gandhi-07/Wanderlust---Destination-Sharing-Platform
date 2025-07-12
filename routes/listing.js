const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../Controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingControllers.index))
.post(
  isLoggedIn,
  
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingControllers.createListing)
);

// NEW ROUTE
router.get("/new", isLoggedIn, listingControllers.newListing);


router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingControllers.update)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.destroy)
);


// EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.edit)
);


module.exports = router;
