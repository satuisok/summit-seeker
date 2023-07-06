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

//ROUTE REQUIREMENTS
const destinationRoutes = require('./routes/destinations'); // import the destination routes
const climbingRoutes = require('./routes/climbing'); // import the climbing routes
const reviewRoutes = require('./routes/reviews'); // import the review routes

const ExpressError = require('./utils/ExpressError'); // ExpressError is used to create custom error messages




//DB models
const Rock = require('./models/rocks');
const Review = require('./models/reviews');
const Route = require('./models/routes');


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



//ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.use('/destination', destinationRoutes); // use the destination routes
app.use('/destination/:id/routes', climbingRoutes); // use the climbing routes
app.use('/destination/:id/reviews', reviewRoutes); // use the review routes

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