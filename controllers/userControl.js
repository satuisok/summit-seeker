const User = require('../models/user');

//register form
module.exports.registerForm = (req, res) => {
    res.render('users/register');
};

//register post new user
module.exports.registerPost = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Summit Seeker!');
            res.redirect('/destination');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
};

//login form
module.exports.loginForm = (req, res) => {
    res.render('users/login');
};

//login post
module.exports.loginPost = (req, res) => {
    const redirectUrl = req.session.returnTo || '/destination';
    req.flash('success', 'Welcome Back!');
    res.redirect(redirectUrl);
};

//logout
module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/destination');
    });
};