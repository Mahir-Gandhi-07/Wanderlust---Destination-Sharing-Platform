const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const { q } = req.query;

  let filter = {};

  if (q) {
    filter = {
      $or: [
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
      ]
    };
  }

  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings, q });
};


module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image= {url,filename};
  await newListing.save();
  req.flash("success", "New Listing Created!!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "The listing you requested does not exist!!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you requested does not exist!!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }
  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!!");
  res.redirect("/listings");
};
