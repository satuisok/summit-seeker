if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const methodOverride = require('method-override'); // method-override is used to override the POST method in the form to PUT method
const path = require('path'); // path module is used to set the path for the views folder
const ejsMate = require('ejs-mate'); // ejs-mate is a layout engine for ejs
const passport = require('passport'); // passport is used for authentication
const localStrategy = require('passport-local'); // passport-local is used for local authentication
const helmet = require('helmet'); // helmet is used to set the HTTP headers for security


//ROUTE REQUIREMENTS
const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/users');
const destinationRoutes = require('./routes/destinations'); // import the destination routes
const climbingRoutes = require('./routes/climbing'); // import the climbing routes
const reviewRoutes = require('./routes/reviews'); // import the review routes


const session = require('express-session'); // express-session is used to create a session
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); // connect-flash is used to create flash messages
const mongoSanitize = require('express-mongo-sanitize'); // express-mongo-sanitize is used to sanitize the user input
const ExpressError = require('./utils/ExpressError'); // ExpressError is used to create custom error messages




//DB models
const Rock = require('./models/rocks');
const Review = require('./models/reviews');
const Route = require('./models/routes');
const User = require('./models/user');


/********* connect to MongoDB ***********/

const mongoose = require('mongoose');
const dbUrl = 'mongodb://127.0.0.1:27017/summit-seeker';
//process.env.DB_URL
async function main() {
    await mongoose.connect(dbUrl);
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

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

const sessionConfig = {
    name: 'session_ct',
    secret: 'thiswillbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7), // set the cookie to expire in 1 week
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
}

app.use(mongoSanitize()); // use express-mongo-sanitize to sanitize the user input
app.use(session(sessionConfig)); // use express-session to create a session
app.use(flash()); // use connect-flash to create flash messages 

app.use(helmet()); // use helmet to set the HTTP headers for security

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com",
    "https://use.fontawesome.com/",

];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",

];
const fontSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/doxttwwnh/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://cdn.weatherapi.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize()); // use passport to initialize the session
app.use(passport.session()); // use passport to create a session
passport.use(new localStrategy(User.authenticate())); // use passport-local to authenticate the user
passport.serializeUser(User.serializeUser()); // use passport to serialize the user. This means that passport will store the user id in the session
passport.deserializeUser(User.deserializeUser()); // use passport to deserialize the user. This means that passport will get the user id from the session and find the user in the database


app.use((req, res, next) => {
    res.locals.currentUser = req.user; // set the currentUser to the user in the session
    res.locals.success = req.flash('success'); // set the success flash message
    res.locals.error = req.flash('error'); // set the error flash message
    next();
})

//ROUTES
app.use('/', homeRoutes);
app.use('/', userRoutes);
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