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

const opts = { toJSON: { virtuals: true } }; // This will allow the virtuals to be included in the res.json() output.

const RockSchema = new Schema({
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
    typeTotal: {
        sport: {
            type: Number,
            default: 0
        },
        trad: {
            type: Number,
            default: 0
        },
        topRope: {
            type: Number,
            default: 0
        },
        boulder: {
            type: Number,
            default: 0
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    avgRating: {
        type: Number,
        default: 0
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, opts);

RockSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/destination/${this._id}">${this.name}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


// Post hook to delete all reviews and routes associated with a rock when it is deleted
RockSchema.post('findOneAndDelete', async function (doc) {
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


const Rock = mongoose.model('Rock', RockSchema);

module.exports = Rock;