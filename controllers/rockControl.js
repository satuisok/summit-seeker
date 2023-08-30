const Rock = require('../models/rocks');
const Review = require('../models/reviews');
const { cloudinary } = require('../cloudinary');
const axios = require('axios');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // import the geocoding module
const weatherAppKey = process.env.WEATHER_API_KEY; // import the weather app key
const mapBoxToken = process.env.MAPBOX_TOKEN; // import the mapbox token
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); // create a geocoder object



//destination index controls
module.exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // reg.query.page is the page number in the url. This is used to set the page number in the pagination.
    const limit = parseInt(req.query.limit) || 20; // reg.query.limit is the limit number in the url. This is used to set the limit number in the pagination.

    const skip = (page - 1) * limit; // skip is used to skip the number of documents in the database. This is used to set the page number in the pagination.

    const rocks = await Rock.find({}).populate('author').skip(skip).limit(limit);
    const mapDestinations = await Rock.find({});

    res.render('destination', {
        rocks, mapDestinations, page, limit
    });
};


//destination search controls
module.exports.search = async (req, res) => {
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
};

//destination new form
module.exports.new = (req, res) => {
    res.render('new');
};

//destination new controls
module.exports.newDestination = async (req, res) => {
    const locationData = req.body.rock.location;
    const locationQuery = `${locationData.area}, ${locationData.state}, ${locationData.country}`;
    const geoData = await geocoder.forwardGeocode({
        query: locationQuery,
        limit: 1
    }).send()

    const rock = new Rock(req.body.rock);
    rock.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    rock.author = req.user._id;
    rock.geometry = geoData.body.features[0].geometry;
    await rock.save();
    console.log(rock);
    req.flash('success', 'New Climbing Destination Created!');
    res.redirect(`/destination/${rock._id}`);
};

//destination show page controls
module.exports.show = async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id).populate({
        path: 'routes',
        populate: {
            path: 'creator'
        }
    }).populate('author');
    if (!rock) {
        req.flash('error', 'Destination Not Found!');
        return res.redirect('/destination');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const reviewTotal = await Review.countDocuments({ rock: rock._id })
    const totalPages = Math.ceil(reviewTotal / limit)
    console.log(totalPages)
    const reviews = await Review.find({ rock: rock._id }).populate('author').skip(skip).limit(limit);
    console.log(reviewTotal);




    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherAppKey}&q=${rock.geometry.coordinates[1]},${rock.geometry.coordinates[0]}&days=3&aqi=no&alerts=no`;

        const response = await axios.get(url);
        const weatherData = response.data;

        // format date for forecast 
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return daysOfWeek[date.getDay()];
        };

        // forecast data
        const forecast = {
            currentDate: formatDate(weatherData.forecast.forecastday[0].date),
            currentTemp: weatherData.forecast.forecastday[0].day.avgtemp_c,
            currentIcon: weatherData.forecast.forecastday[0].day.condition.icon,
            tomorrow: formatDate(weatherData.forecast.forecastday[1].date),
            tomorrowTemp: weatherData.forecast.forecastday[1].day.avgtemp_c,
            tomorrowIcon: weatherData.forecast.forecastday[1].day.condition.icon,
            dayAfter: formatDate(weatherData.forecast.forecastday[2].date),
            dayAfterTemp: weatherData.forecast.forecastday[2].day.avgtemp_c,
            dayAfterIcon: weatherData.forecast.forecastday[2].day.condition.icon
        }

        res.render('show', { rock, reviews, page, limit, totalPages, reviewTotal, forecast });

    } catch (e) {
        res.render('show', { rock });
    }

};

//destination show page edit form
module.exports.editShowForm = async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    if (!rock) {
        req.flash('error', 'Destination Not Found!');
        return res.redirect('/destination');
    }
    res.render('edit', { rock });
};

//destination edit show page controls
module.exports.editShow = async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findByIdAndUpdate(id, { ...req.body.rock });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    rock.image.push(...imgs);
    await rock.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await rock.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })

    }
    req.flash('success', 'Destination Updated!');
    res.redirect(`/destination/${rock._id}`);
};

//destination delete controls
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    const deletedRock = await Rock.findByIdAndDelete(id);
    res.redirect('/destination');
};