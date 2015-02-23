var express = require('express');
var router = express.Router();
var passwordless = require('passwordless');
var requestTokenFn = require('../lib/passwordless/requestToken');

router.get('/', function(req, res) {
    res.render('index', {
        title: 'PJ 2015 Program'
    });
});

router.get('/login', function(req, res) {
    res.render('login', {
        auth_message: req.flash('passwordless'),
        success_flash: req.flash('passwordless-success'),
        origin: req.query.origin,
        title: 'PJ 2015 Program - Login'
    });
});

router.post('/login',
    passwordless.requestToken(requestTokenFn, {
        failureRedirect: '/login',
        failureFlash: 'The email address you entered could not be found. Access to this site is restricted to PJ Program Staff, and registered Unit Leaders. If you are a Unit Leader, you will receive an email once your registration has been received from the PJ Registrar. For further assistance, please contact us at <a href="mailto:programselection@pj2015.ca">programselection@pj2015.ca</a>.',
        originField: 'origin',
        successFlash: 'Your sign in email has been sent. Please check your email for a message from programselection@pj2015.ca.'
    }),
    function(req, res) {
        res.redirect('/login');
    }
);

router.get('/logout', passwordless.logout(), function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            debug(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
