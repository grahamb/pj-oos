var express = require('express');
var router = express.Router();
var passwordless = require('passwordless');
var requestTokenFn = require('../lib/passwordless/requestToken');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/login', function(req, res) {
    res.render('login', {
        auth_message: req.flash('passwordless'),
        origin: req.query.origin
    });
});

router.post('/login',
    passwordless.requestToken(requestTokenFn, {
        failureRedirect: '/login',
        failureFlash: 'The email address you entered could not be found.',
        originField: 'origin'
    }),
    function(req, res) {
        res.send('sent');
    }
);

router.get('/logout', passwordless.logout(),
    function(req, res) {
        res.redirect('/');
});

module.exports = router;
