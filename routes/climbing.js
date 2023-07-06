const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams allows us to access the params from the parent router.
const Rock = require('../models/rocks');
const Route = require('../models/routes');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { routeSchema } = require('../joiSchemas');


const validateRoute = (req, res, next) => {
    const { error } = routeSchema.validate(req.body); // validate the form data using the routeSchema
    if (error) {
        const msg = error.details.map(el => el.message).join(','); // create a custom error message
        throw new ExpressError(msg, 400); // throw an ExpressError if the form data is invalid
    } else {
        next();
    }
}

router.get('/newroute', catchAsync(async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    res.render('route', { rock });
}));

router.post('/', validateRoute, catchAsync(async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    const route = new Route(req.body.route);
    rock.routes.push(route);
    await route.save();
    await rock.save();
    res.redirect(`/destination/${rock._id}`);
}))

router.delete('/:routeId', catchAsync(async (req, res) => {
    const { id, routeId } = req.params;
    await Rock.findByIdAndUpdate(id, { $pull: { routes: routeId } });
    await Route.findByIdAndDelete(routeId);
    res.redirect(`/destination/${id}`);
}));

module.exports = router;