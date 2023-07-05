if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const methodOverride = require('method-override'); // method-override is used to override the POST method in the form to PUT method
const path = require('path'); // path module is used to set the path for the views folder
const ejsMate = require('ejs-mate'); // ejs-mate is a layout engine for ejs
const multer = require('multer'); // multer is a node module for file uploads
const upload = multer({ dest: 'uploads/' }); // set the destination folder for the uploaded files

const ExpressError = require('./utils/ExpressError'); // ExpressError is used to create custom error messages
const catchAsync = require('./utils/catchAsync'); // catchAsync is used to catch the errors in async functions

const { rockSchema } = require('./joiSchemas'); // joiSchemas is used to validate the form data
//DB models
const Rock = require('./models/rocks');


/********* connect to MongoDB ***********/

const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/summit-seeker');
}

main()
    .then(() => console.log('Database connected!'))
    .catch(err => console.log(err));

/********* connect to MongoDB ***********/

app.set('view engine', 'ejs'); // set the view engine to ejs
app.engine('ejs', ejsMate); // set ejs-mate as the layout engine for ejs
app.set('views', path.join(__dirname, 'views')); // set the path for the views folder

app.use(express.static(path.join(__dirname, 'public'))); // set the path for the public folder
app.use(express.urlencoded({ extended: true })); // use express.urlencoded to parse the form data
app.use(methodOverride('_method')); // use method-override to override the POST method in the form to PUT method

app.get('/', (req, res) => {
    res.render('home');
});

const validateRock = (req, res, next) => {
    const { error } = rockSchema.validate(req.body); // validate the form data using the rockSchema
    if (error) {
        const msg = error.details.map(el => el.message).join(','); // create a custom error message
        throw new ExpressError(msg, 400); // throw an ExpressError if the form data is invalid
    } else {
        next();
    }
}


app.get('/destination', catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // reg.query.page is the page number in the url. This is used to set the page number in the pagination.
    const limit = parseInt(req.query.limit) || 20; // reg.query.limit is the limit number in the url. This is used to set the limit number in the pagination.

    const skip = (page - 1) * limit; // skip is used to skip the number of documents in the database. This is used to set the page number in the pagination.

    const rocks = await Rock.find({}).skip(skip).limit(limit);

    res.render('index', { rocks, page, limit });
}));

app.post('/search', catchAsync(async (req, res) => {
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

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/destination', validateRock, catchAsync(async (req, res) => {
    try {
        const rock = new Rock(req.body);
        await rock.save();
        res.redirect(`/destination/${rock._id}`);
    }
    catch (e) {
        next(e);
    }

}));

app.get('/destination/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    console.log(rock);
    res.render('show', { rock })
}));

app.get('/destination/:id/edit', catchAsync(async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    res.render('edit', { rock });
}));

app.put('/destination/:id', validateRock, catchAsync(async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findByIdAndUpdate(id, { ...req.body.rock });
    res.redirect(`/destination/${rock._id}`);
}));

app.delete('/destination/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const deletedRock = await Rock.findByIdAndDelete(id);
    res.redirect('/destination');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});



app.listen(3000, () => {
    console.log('Listening on port 3000');
});