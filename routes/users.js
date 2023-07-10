const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/userControl');

//register form
router.get('/register', users.registerForm)

//register post new user
router.post('/register', catchAsync(users.registerPost))

//login form
router.get('/login', users.loginForm);

//login post
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginPost);

//logout
router.get('/logout', users.logout);

module.exports = router;
