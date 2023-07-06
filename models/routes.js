const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeSchema = new Schema({
    name: String,
    grade: String,
    types: {
        type: String,
        enum: ['sport', 'trad', 'top rope', 'boulder'],
        lowercase: true
    },
    pitches: Number,
    description: String
});

module.exports = mongoose.model('Route', routeSchema);