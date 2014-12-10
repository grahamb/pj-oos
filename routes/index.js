var express = require('express');
var router = express.Router();
var QueryChainer = require('sequelize').Utils.QueryChainer;
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res) {
    var chainer = new QueryChainer;
    chainer
        .add(models.Program.all())
        .add(models.Staff.findAll({
            include: [ models.Program ]
        }))
        .run()
        .success(function(results) {
            res.render('index', {
                title: 'PJ 2015 Program OOS',
                programs: results[0],
                staff: results[1]
            });
        })
        .error(function(err) {
        });
});

module.exports = router;