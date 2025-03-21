// const express = require("express");
// const wrapAsync = require("../utils/wrapAsync");
// const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
// const reviewController = require("../controllers/reviews");

// const router = express.Router();

// // Add a review
// router.post(
//     "/listings/:id/reviews",
//     isLoggedIn,
//     validateReview,
//     wrapAsync(reviewController.createReview)
//     let newReview=new Review(requestAnimationFrame.body.review);
//     newReview.author=
// );

// // Delete a review (Added isLoggedIn & isReviewAuthor)
// router.delete(
//     "/listings/:id/reviews/:reviewId",
//     isLoggedIn, 
//     isReviewAuthor,  
//     wrapAsync(reviewController.destroyReview)
// );

// module.exports = router;

const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");
const Review = require("../models/review"); // Ensure Review model is required

const router = express.Router();

// Add a review
router.post(
    "/listings/:id/reviews",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res, next) => {
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        await newReview.save();
        res.redirect(`/listings/${req.params.id}`);
    })
);

// Delete a review (Added isLoggedIn & isReviewAuthor)
router.delete(
    "/listings/:id/reviews/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
