var express = require('express');
var router = express.Router();
var models = require('../models');
var QueryChainer = require('sequelize').Utils.QueryChainer;

function find_by_id(id) {
    return models.Staff.find({
        where: {id: id},
        include: [ models.Program ]
    });
}

router.get('/', function(req, res) {
    var staffFilter;
    switch (req.query.program) {
        case 'all':
        case undefined:
            staffFilter = {};
            break;
        case 'unassigned':
            staffFilter = { ProgramId: null };
            break;
        default:
            staffFilter = { ProgramId: req.query.program };
            break;
    }
    var chainer = new QueryChainer;
    chainer
        .add(models.Program.all())
        .add(models.Staff.findAll({
            where: staffFilter,
            include: [ models.Program ]
        }))
        .run()
        .success(function(results) {
            res.render('oos/index', {
                title: 'PJ 2015 Program OOS',
                programs: results[0],
                staff: results[1]
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
                res.redirect(req.params.id);
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
