// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/expressError.js");
// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
// const { listingSchema, reviewSchema } = require("../schema.js");
// const { isLoggedIn } = require("../middleware.js");

// // Validate review
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };

// // Route to get all listings
// router.get("/", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// }));

// // Route to get the new listing form
// router.get("/new",isLoggedIn, (req, res) => {
//     console.log(req.user);
   

//     res.render("listings/new");
// });

// // Route to create a new listing
// router.post("/", async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     newListing.Owner=req.user._id;
//     await newListing.save();
//     req.flash("success", "Successfully created a new listing!"); // Set success flash message
//     res.redirect("/listings"); // Redirect to listings page
// });

// // Route to get a listing by ID
// router.get("/:id",isLoggedIn, wrapAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
    
//     // Check if listing exists
//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings"); // Redirect to listings page
//     }
    
//     res.render("listings/show", { listing });
// }));

// // Route to edit a listing by ID
// router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
//     const listing = await Listing.findById(req.params.id);
    
//     // Check if listing exists
//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }

//     res.render("listings/edit", { listing });
// }));

// // Route to update a listing by ID
// router.put("/:id",isLoggedIn= (req, res,next) => {
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl=req.originalUrl;
//         req.flash("error","you must be logged in to create listing!");
//         return res.redirect("/login");


//     }
//     next();
// };
    
    
//     // Check if listing exists
//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }
    
//     req.flash("success", "Successfully updated the listing!"); // Flash success message
//     res.redirect("/listings");
// }));

// // Route to delete a listing by ID
// router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
//     const listing = await Listing.findByIdAndDelete(req.params.id);
    
//     // Check if listing exists
//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }

//     req.flash("success", "Successfully deleted the listing!"); // Flash success message
//     res.redirect("/listings");
// }));

// // Reviews

// // Route to add a review to a listing
// router.post("/:id/reviews", validateReview, wrapAsync(async (req, res) => {
//     const listing = await Listing.findById(req.params.id);
    
//     // Check if listing exists
//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }

//     const newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
    
//     req.flash("success", "Successfully added a new review!"); // Flash success message
//     res.redirect(/listings/${listing._id});
// }));

// // Route to delete a review from a listing
// router.delete("/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;

//     const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
    
//     // Check if listing exists
//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }

//     req.flash("success", "Successfully deleted the review!"); // Flash success message
//     res.redirect(/listings/${id});
// }));

// module.exports = router;
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage})
// Validate review middleware
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Routes
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        
        upload.single("listing[image]"), // Fixed typo in field name
        wrapAsync(listingController.createListing) // Fixed misplaced parentheses
    );


// ✅ Move "/new" route BEFORE "/:id"
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, 
        upload.single("listing[image]"),
        validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

router.post("/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "Successfully added a new review!");
    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;

