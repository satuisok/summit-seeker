const mongoose = require('mongoose');
const Route = require('./routes');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const rockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        area: String,
        state: String,
        country: String
    },
    image: [ImageSchema],
    description: String,
    routes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Route'
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


// Post hook to delete all reviews and routes associated with a rock when it is deleted
rockSchema.post('findOneAndDelete', async function (doc) {
    if (doc) { // If the document exists (i.e. it wasn't already deleted) then delete all reviews and routes associated with it
        await Review.deleteMany({
            _id: {
                $in: doc.reviews // Delete all reviews where the id is in the doc.reviews array
            }
        })
        await Route.deleteMany({
            _id: {
                $in: doc.routes // Delete all routes where the id is in the doc.routes array
            }
        })
    }
})


const Rock = mongoose.model('Rock', rockSchema);

module.exports = Rock;