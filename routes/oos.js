var express = require('express');
var router = express.Router();
var models = require('../models');
var OOS = models.OOS, Program = models.Program;
var QueryChainer = require('sequelize').Utils.QueryChainer;

function find_by_id(id) {
    return models.Staff.find({
        where: {id: id},
        include: [ models.Program ]
    });
}

router.get('/', function(req, res) {
    var assignmentFilter;
    if (req.query.program && (!isNaN(req.query.program))) {
        assignmentFilter = { id: req.query.program };
    } else {
        assignmentFilter = {};
    }

    var chainer = new QueryChainer;
    chainer
        .add(Program.findAll({
            order: 'id ASC'
        }))
        .add(OOS.findAll({
            include: [ { model: Program, where: assignmentFilter } ]
        }))
        .run()
        .success(function(results) {
            res.render('oos/index', {
                title: 'PJ 2015 Program OOS',
                programs: results[0],
                oos: results[1]
            });
        })
        .error(function(err) {
            console.log(err);
            res.render('error');
        });
});

router.get('/:id', function(req, res) {
    find_by_id(req.params.id).then(function(record) {
        res.render('oos/oos', {
            oos: record
        });
    });
});

router.post('/:id', function(req, res) {
    if (req.body.ProgramId === '') { req.body.ProgramId = null; }
    find_by_id(req.params.id).then(function(record) {
        record.updateAttributes(req.body).then(function() {
            if (req.xhr) {
                res.send(200);
            } else {
                res.redirect('/oos/' + req.params.id);
            }
        });
    });
});

router.get('/:id/edit', function(req, res) {
    var chainer = new QueryChainer;
    chainer
        .add(models.Program.all())
        .add(find_by_id(req.params.id))
        .run()
        .success(function(results) {
            res.render('oos/oos_edit', {
                programs: results[0],
                oos: results[1]
            });
        });
});

module.exports = router;


