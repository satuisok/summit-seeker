const express = require('express');
const router = express.Router();
const Rock = require('../models/rocks');
const { validateRock, isLoggedIn, isAuthor } = require('../middleware');
const multer = require('multer'); // multer is a node module for file uploads
const { storage } = require('../cloudinary'); // import the storage from cloudinary
const upload = multer({ storage }); // set the destination folder for the uploaded files
const destinations = require('../controllers/rockControl');
const catchAsync = require('../utils/catchAsync');


//destinations index
router.get('/', catchAsync(destinations.index));

//destinations search
router.post('/search', catchAsync(destinations.search));

//destinations new form
router.get('/new', destinations.new);

//destinations new post
router.post('/', isLoggedIn, upload.array('image'), validateRock, catchAsync(destinations.newDestination));

//destinations show page
router.get('/:id', catchAsync(destinations.show));

//destinations show edit form
router.get('/:id/edit', isLoggedIn, catchAsync(destinations.editShowForm));

//destinations edit show page
router.put('/:id', isLoggedIn, isAuthor, validateRock, catchAsync(destinations.editShow));

//destinations delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(destinations.delete));


module.exports = router;