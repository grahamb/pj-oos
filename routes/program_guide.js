var express = require('express');
var router = express.Router();
var models = require('../models');
var Program = models.Program;
var Promise = require('sequelize').Promise;
var role = require('connect-acl')(require('../lib/roles'));

router.get('/', function(req, res) {
    res.render('program_guide/index', {
        title: 'PJ 2015 Program Guide'
    });
});

module.exports = router;