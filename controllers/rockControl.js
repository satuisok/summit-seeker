const Rock = require('../models/rocks');


//destination index controls
module.exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // reg.query.page is the page number in the url. This is used to set the page number in the pagination.
    const limit = parseInt(req.query.limit) || 20; // reg.query.limit is the limit number in the url. This is used to set the limit number in the pagination.

    const skip = (page - 1) * limit; // skip is used to skip the number of documents in the database. This is used to set the page number in the pagination.

    const rocks = await Rock.find({}).skip(skip).limit(limit);

    res.render('destination', { rocks, page, limit });
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
    const rock = new Rock(req.body.rock);
    rock.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    rock.author = req.user._id;
    await rock.save();
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
};

//destination show page edit form
module.exports.editShowForm = async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findById(id);
    res.render('edit', { rock });
};

//destination edit show page controls
module.exports.editShow = async (req, res) => {
    const id = req.params.id;
    const rock = await Rock.findByIdAndUpdate(id, { ...req.body.rock });
    if (!rock) {
        req.flash('error', 'Destination Not Found!');
        return res.redirect('/destination');
    } else {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        rock.image.push(...imgs);
        await rock.save();
        req.flash('success', 'Destination Updated!');
        res.redirect(`/destination/${rock._id}`);
    }
};

//destination delete controls
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    const deletedRock = await Rock.findByIdAndDelete(id);
    res.redirect('/destination');
};