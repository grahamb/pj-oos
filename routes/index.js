var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res) {
  models.Staff.findAll({
      include: [ models.Program ]
    }).success(function(staff) {
      res.render('index', {
        title: 'Express',
        staff: staff
      });
    });
});

module.exports = router;