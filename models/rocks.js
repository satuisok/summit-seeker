const mongoose = require('mongoose');

const rockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        area: String,
        state: String,
        country: String
    },
    image: String,
    description: String
});

const Rock = mongoose.model('Rock', rockSchema);

module.exports = Rock;