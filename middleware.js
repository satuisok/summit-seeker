const Rock = require('./models/rocks'); // require the Rock model
const Route = require('./models/routes'); // require the Route model
const Review = require('./models/reviews'); // require the Review model
const { rockSchema } = require('./joiSchemas.js'); // require the Joi schema
const ExpressError = require('./utils/ExpressError'); // require the ExpressError class


module.exports.validateRock = (req, res, next) => {
    const { error } = rockSchema.validate(req.body); // validate the form data using the rockSchema
    if (error) {
        const msg = error.details.map(el => el.message).join(','); // create a custom error message
        throw new ExpressError(msg, 400); // throw an ExpressError if the form data is invalid
    } else {
        next();
    }
}


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}



module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    if (!rock.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/destination/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/destination/${id}`);
    }
    next();
}

module.exports.isRouteAuthor = async (req, res, next) => {
    const { id, routeId } = req.params;
    const route = await Route.findById(routeId);
    if (!route.creator.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/destination/${id}`);
    }
    next();
}