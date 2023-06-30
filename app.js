if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path'); // path module is used to set the path for the views folder
const ejsMate = require('ejs-mate'); // ejs-mate is a layout engine for ejs
const multer = require('multer'); // multer is a node module for file uploads
const upload = multer({ dest: 'uploads/' }); // set the destination folder for the uploaded files


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


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/index', async (req, res) => {
    const rocks = await Rock.find({});
    res.render('index', { rocks });
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});