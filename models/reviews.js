const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    rock: {
        type: Schema.Types.ObjectId,
        ref: 'Rock'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

ReviewSchema.post('save', async function () {
    const reviewRock = await this.rock.populate('reviews', 'rating');
    const totalLength = this.rock.reviews.length;

    const totalRating = reviewRock.reviews.reduce(function (acc, review) {
        return acc + review.rating;
    }, 0);
    const newAvg = Math.round(totalRating / totalLength);

    this.rock.avgRating = newAvg;
    await this.rock.save();

})

ReviewSchema.post('findOneAndDelete', async function (review) {
    const rockAverage = await review.populate('rock', 'avgRating');
    const rockRating = await review.populate(
        {
            path: 'rock',
            populate: {
                path: 'reviews',
            }
        }
    );

    const totalLength = rockRating.rock.reviews.length;

    const totalRating = rockRating.rock.reviews.reduce(function (acc, review) {
        return acc + review.rating;
    }, 0);

    const newAvg = Math.round(totalRating / totalLength);
    rockAverage.rock.avgRating = newAvg;

    await rockAverage.rock.save();
    console.log(rockAverage.rock.avgRating);
    console.log(newAvg);

})

module.exports = mongoose.model('Review', ReviewSchema);