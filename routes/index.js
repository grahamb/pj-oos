var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res) {
    models.Program.findAll().then(function(programs) {
        models.Staff.findAll({
            include: [ models.Program ]
        }).then(function(staff) {
            res.render('index', {
              title: 'Express',
              staff: staff,
              programs: programs
            });
        });
    });
});

module.exports = router;