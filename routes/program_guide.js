var express = require('express');
var router = express.Router();
var models = require('../models');
var Program = models.Program;
var Promise = require('sequelize').Promise;
var role = require('connect-acl')(require('../lib/roles'));

router.get('/', function(req, res) {
  Program.findAll({
    where: {
      hidden: false
    },
    order: 'location ASC'
  }).then(function(programs) {
    res.render('program_guide/index', {
        title: '- Program Guide',
        programs: programs
    });
  })
});

module.exports = router;