var express = require('express');
var router = express.Router();
var models = require('../models');
var QueryChainer = require('sequelize').Utils.QueryChainer;

/* GET users listing. */

function find_by_id(id) {
    return models.Staff.find({
        where: {id: id},
        include: [ models.Program ]
    });
}

router.get('/:id', function(req, res) {
    find_by_id(req.params.id).then(function(record) {
        res.render('oos', {
            oos: record
        });
    });
});

router.post('/:id', function(req, res) {
    find_by_id(req.params.id).then(function(record) {
        record.updateAttributes(req.body).then(function() {
            res.redirect(req.params.id);
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
            res.render('oos_edit', {
                programs: results[0],
                oos: results[1]
            });
        });
});

module.exports = router;
