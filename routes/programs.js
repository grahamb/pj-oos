var express = require('express');
var router = express.Router();
var models = require('../models');
var Program = models.Program, OOS = models.OOS;
var QueryChainer = require('sequelize').Utils.QueryChainer;
var passwordless = require('passwordless');

router.get('/', function(req, res) {
    Program.findAll({ order: 'id ASC', where: { hidden: false }, include: [{model: OOS, as: 'OOS'}] }).then(function(programs) {
        res.render('programs/index', {
            title: 'PJ 2015 Programs',
            programs: programs
        });
    });
});

router.get('/:id', function(req, res) {
    var chainer = new QueryChainer;
    chainer
        .add(Program.find({
            where: { id: req.params.id },
            include: [{model: OOS, as: 'OOS'}]
        }))
        .add(Program.findAll({ where: {hidden: false} }))
        .run()
        .success(function(results) {
            console.log(results[1]);
            res.render('programs/program', {
                title: 'PJ 2015 Programs - ' + results[0].name,
                program: results[0],
                all_programs: results[1]
            });
        });
});

router.post('/:id', passwordless.restricted({
    failureRedirect: '/login',
    originField: 'origin'
}), function(req, res) {
    Program.find({
        where: { id: req.params.id }
    }).then(function(record) {
        record.updateAttributes(req.body, { fields: Object.keys(req.body) }).then(function() {
            res.redirect('/programs/' + req.params.id);
        }).catch(function(error) {
            console.log(error);
            res.render('error', { message: 'oops', error: error });
        });
    });
});

router.get('/:id/edit', passwordless.restricted({
    failureRedirect: '/login',
    originField: 'origin'
}), function(req, res) {
    Program.find({
        where: { id: req.params.id }
    }).then(function(program) {
        res.render('programs/program_edit', {
            title: 'PJ 2015 - Edit Program Record',
            program: program
        });
    });
});

module.exports = router;