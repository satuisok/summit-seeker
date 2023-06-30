//express is a node module for building HTTP servers
const express = require('express');
const app = express();
const path = require('path'); // path module is used to set the path for the views folder

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
app.set('views', path.join(__dirname, 'views')); // set the path for the views folder

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