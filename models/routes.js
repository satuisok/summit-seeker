const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Rock = require('./rocks');

const routeSchema = new Schema({
    name: String,
    grade: String,
    types: {
        type: String,
        enum: ['sport', 'trad', 'top rope', 'boulder'],
        lowercase: true
    },
    pitches: Number,
    description: String,
    rock: {
        type: Schema.Types.ObjectId,
        ref: 'Rock'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


routeSchema.post('save', async function () {
    const route = this;
    if (route.types === 'sport') {
        route.rock.typeTotal.sport += 1;
    }
    if (route.types === 'trad') {
        route.rock.typeTotal.trad += 1;
    }
    if (route.types === 'top rope') {
        route.rock.typeTotal.topRope += 1;
    }
    if (route.types === 'boulder') {
        route.rock.typeTotal.boulder += 1;
    }

    await route.rock.save();
})

routeSchema.post('findOneAndDelete', async function (route) {
    const deletedRock = await route.populate('rock', 'typeTotal');

    if (route.types === 'sport') {
        route.rock.typeTotal.sport -= 1;
    }
    if (route.types === 'trad') {
        route.rock.typeTotal.trad -= 1;
    }
    if (route.types === 'top rope') {
        route.rock.typeTotal.topRope -= 1;
    }
    if (route.types === 'boulder') {
        route.rock.typeTotal.boulder -= 1;
    }

    await route.rock.save();
})


module.exports = mongoose.model('Route', routeSchema);