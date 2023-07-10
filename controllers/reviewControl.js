const Rock = require('../models/rocks');
const Review = require('../models/reviews');


module.exports.newReviewPost = async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    rock.reviews.push(review);
    await review.save();
    await rock.save();
    req.flash('success', 'New Review Created!');
    res.redirect(`/destination/${rock._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Rock.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/destination/${id}`);
};