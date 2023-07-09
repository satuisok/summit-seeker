const express = require('express');
const router = express.Router();
const Rock = require('../models/rocks');
const { validateRock, isLoggedIn, isAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');



router.get('/', catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // reg.query.page is the page number in the url. This is used to set the page number in the pagination.
    const limit = parseInt(req.query.limit) || 20; // reg.query.limit is the limit number in the url. This is used to set the limit number in the pagination.

    const skip = (page - 1) * limit; // skip is used to skip the number of documents in the database. This is used to set the page number in the pagination.

    const rocks = await Rock.find({}).skip(skip).limit(limit);

    res.render('destination', { rocks, page, limit });
}));

router.post('/search', catchAsync(async (req, res) => {
    const searchQuery = req.body.search;
    const query = {
        $or: [
            { name: { $regex: searchQuery, $options: 'i' } }, // Match name case-insensitively
            { 'location.area': { $regex: searchQuery, $options: 'i' } }, // Match area case-insensitively
            { 'location.country': { $regex: searchQuery, $options: 'i' } } // Match country case-insensitively
        ]
    };
    const rocks = await Rock.find(query);
    res.render('search-results', { rocks, searchQuery });
}));

router.get('/new', (req, res) => {
    res.render('new');
});

router.post('/', isLoggedIn, validateRock, catchAsync(async (req, res) => {
    const rock = new Rock(req.body.rock);
    rock.author = req.user._id;
    await rock.save();
    req.flash('success', 'New Climbing Destination Created!');
    res.redirect(`/destination/${rock._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id).populate({
        path: 'routes',
        populate: {
            path: 'creator'
        }
    }).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!rock) {
        req.flash('error', 'Destination Not Found!');
        return res.redirect('/destination');
    } else {
        res.render('show', { rock })
    }
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    res.render('edit', { rock });
}));

router.put('/:id', isLoggedIn, isAuthor, validateRock, catchAsync(async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findByIdAndUpdate(id, { ...req.body.rock });
    if (!rock) {
        req.flash('error', 'Destination Not Found!');
        return res.redirect('/destination');
    } else {
        req.flash('success', 'Destination Updated!');
        res.redirect(`/destination/${rock._id}`);
    }


}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const id = req.params.id;
    const deletedRock = await Rock.findByIdAndDelete(id);
    res.redirect('/destination');
}));


module.exports = router;