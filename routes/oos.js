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
        });
    });
});

router.get('/:id/edit', function(req, res) {
    find_by_id(req.params.id).then(function(oos) {
        res.render('oos_edit', {
            oos: oos
        });
    });
});

module.exports = router;
