const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams allows us to access the params from the parent router.
const Rock = require('../models/rocks');
const Route = require('../models/routes');
const { isLoggedIn, isRouteAuthor, validateRoute } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const routes = require('../controllers/routeControl');


//routes new form
router.get('/newroute', isLoggedIn, catchAsync(routes.newRouteForm));

//routes new post
router.post('/', isLoggedIn, validateRoute, catchAsync(routes.newRoutePost));

//routes delete
router.delete('/:routeId', isLoggedIn, isRouteAuthor, catchAsync(routes.deleteRoute));

module.exports = router;