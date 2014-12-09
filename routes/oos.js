var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET users listing. */

function find_by_id(id) {
    return models.Staff.find({
        where: {id: id},
        include: [ models.Program ]
    });
}

router.get('/:id', function(req, res) {
    find_by_id(req.params.id).then(function(oos) {
        res.render('oos', {
            oos: oos
router.post('/:id', function(req, res) {
    find_by_id(req.params.id).then(function(record) {
        record.updateAttributes(req.body).then(function() {
            res.redirect(req.params.id);
        });
    });
});

router.get('/:id/edit', function(req, res) {
    find_by_id(req.params.id).then(function(record) {
        record.Program.Model.all().then(function(programs) {
            res.render('oos_edit', {
                oos: record,
                programs: programs
            });
        });
    });
});

module.exports = router;
