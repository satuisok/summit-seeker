const express = require('express');
const router = express.Router({ mergeParams: true }); // merge the params from the destination and climbing routes
const Rock = require('../models/rocks');
const Review = require('../models/reviews');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviewControl');


//post new review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.newReviewPost));

//delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;