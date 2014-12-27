var express = require('express');
var router = express.Router();
var passwordless = require('passwordless');
var requestTokenFn = require('../lib/passwordless/requestToken');

router.get('/', function(req, res) {
    res.send('hello');
});

router.get('/login', function(req, res) {
    res.render('login', {
        auth_message: req.flash('passwordless'),
        origin: req.query.origin
    });
});

/* POST login details. */
    passwordless.requestToken(requestTokenFn, { failureRedirect: '/login', failureFlash: 'This user is unknown!' }),
        function(req, res) {
            // success!
router.post('/login',
        originField: 'origin'
        res.send('sent');
});

router.get('/logout', passwordless.logout(),
    function(req, res) {
        res.redirect('/');
});

module.exports = router;
