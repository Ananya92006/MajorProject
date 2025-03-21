const Listing=require("../models/listing")

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm= (req, res) => {
    console.log(req.user);
    res.render("listings/new");
};
module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" } // Ensures each review has its author's data
    }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    console.log(listing); 
    res.render("listings/show", { listing });
};


module.exports.createListing = async (req, res) => {
    if (!req.user) {
        req.flash("error", "You must be logged in to create a listing.");
        return res.redirect("/login");
    }

    const { listing } = req.body;
    if (!listing) {
        req.flash("error", "Listing data is missing!");
        return res.redirect("/listings/new");
    }

    let newListing = new Listing(listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = { url: req.file.path, filename: req.file.filename };
    } else {
        req.flash("error", "Listing image is required!");
        return res.redirect("/listings/new");
    }

    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings`);
};



module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/edit", { listing, originalImageUrl: listing.image?.url });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    listing.set(req.body.listing);

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};
