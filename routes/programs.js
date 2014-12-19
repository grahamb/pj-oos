var express = require('express');
var router = express.Router();
var Program = require('../models').Program;
var QueryChainer = require('sequelize').Utils.QueryChainer;

router.get('/', function(req, res) {
    Program.findAll().then(function(programs) {
        res.render('programs/index', {
            title: 'PJ 2015 Programs',
            programs: programs
        });
    });
});

router.get('/:id', function(req, res) {
    Program.find({
        where: { id: req.params.id }
    }).then(function(program) {
        res.render('programs/program', {
            title: 'PJ 2015 Programs - ' + program.name,
            program: program
        });
    });
});

router.post('/:id', function(req, res) {
    Program.find({
        where: { id: req.params.id }
    }).then(function(record) {
        record.updateAttributes(req.body).then(function() {
            res.redirect(req.params.id);
        }).catch(function(error) {
            res.redirect('error', { message: 'oops', error: error });
        });
    });
});

router.get('/:id/edit', function(req, res) {
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