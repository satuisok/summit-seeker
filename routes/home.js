const express = require('express');
const router = express.Router();
const Rock = require('../models/rocks');
const Routes = require('../models/routes');
const homepage = require('../controllers/homePageControl');
const catchAsync = require('../utils/catchAsync');

router.get('/', homepage.home);


module.exports = router;