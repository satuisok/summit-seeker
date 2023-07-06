const express = require('express');
const router = express.Router({ mergeParams: true }); // merge the params from the destination and climbing routes
const Rock = require('../models/rocks');
const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../joiSchemas');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // validate the form data using the reviewSchema
    if (error) {
        const msg = error.details.map(el => el.message).join(','); // create a custom error message
        throw new ExpressError(msg, 400); // throw an ExpressError if the form data is invalid
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    const review = new Review(req.body.review);
    rock.reviews.push(review);
    await review.save();
    await rock.save();
    req.flash('success', 'New Review Created!');
    res.redirect(`/destination/${rock._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Rock.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/destination/${id}`);
}));


module.exports = router;