const Rock = require('../models/rocks');
const Route = require('../models/routes');

module.exports.newRouteForm = async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    res.render('route', { rock });
};

module.exports.newRoutePost = async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    const route = new Route(req.body.route);
    route.creator = req.user._id;
    route.rock = rock;
    rock.routes.push(route);
    await route.save();
    await rock.save();
    req.flash('success', 'New Route Created!');
    res.redirect(`/destination/${rock._id}`);
};

module.exports.deleteRoute = async (req, res) => {
    const { id, routeId } = req.params;
    const deletedRoute = await Route.findById(routeId);
    const routeType = deletedRoute.types;
    await Rock.findByIdAndUpdate(id, { $pull: { routes: routeId } }); // $inc: { 'typeTotal.sport': -1 } is a mongoDB operator that decrements the sport property by 1
    await Route.findByIdAndDelete(routeId);
    req.flash('success', 'Route Deleted!');
    res.redirect(`/destination/${id}`);
};