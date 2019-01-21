const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();
const passport = require('passport');


router.use(csrfProtection);

router.get('/', (req, res, next) => {
    var message = req.flash('error');
    res.render('users/login', {
        messages: message,
        hasErrors: message.length > 0,
        csrfToken: req.csrfToken(),
        layout: false
    });
})

router.get('/signup', (req, res, next) => {
    var message = req.flash('error');
    res.render('users/signup', {
        csrfToken: req.csrfToken(),
        messages: message,
        hasErrors: message.length > 0,
        layout: false
    });
})

router.post('/', passport.authenticate('local.login', {
    successRedirect: '/',
    failureRedirect: '/user',
    failureFlash: true
}));

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user',
    failureRedirect: '/user/signup',
    failureFlash: true
}));


//facebook route

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/user'
    }));


//google route

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));


router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/user',
        successRedirect: '/',
    }));

//logout

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/user');
});



module.exports = router;