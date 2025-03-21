const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview = async (req, res) => {
    console.log(req.user); // Check if the user is logged in

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    newReview.author = req.user ? req.user._id : null; // Ensure author is set
    
    console.log(newReview); // Debugging

    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "New review created");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
};