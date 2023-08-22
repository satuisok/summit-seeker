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
    console.log(totalRating)

    const newAvg = Math.round(totalRating / totalLength);
    console.log(newAvg);
    this.rock.avgRating = newAvg;
    await this.rock.save();

})

module.exports = mongoose.model('Review', ReviewSchema);