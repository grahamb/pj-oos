var express = require('express');
var router = express.Router();
var models = require('../models');
var Program = models.Program, OOS = models.OOS;
var passwordless = require('passwordless');
var role = require('connect-acl')(require('../lib/roles'));
var Promise = require('sequelize').Promise;
var csv = require('csv');

router.get('/', role.can('view program'), function(req, res) {
    Program.findAll({ where: {hidden: false}, order: 'name ASC' }).then(function(programs) {
        res.render('programs/program', {
            title: 'PJ 2015 Program - All Programs',
            all_programs: programs
        });
    });
});

router.get('/oos', passwordless.restricted({ failureRedirect: '/login', originField: 'origin' }), role.isAny(['admin', 'hq staff']), function(req, res) {
    Program.findAll({ order: 'id ASC', where: { hidden: false }, include: [{model: OOS, as: 'OOS'}] }).then(function(programs) {
        res.render('programs/oos_count', {
            title: 'PJ 2015 Program - Program OOS Count',
            programs: programs
        });
    });
});

router.get('/:id', role.can('view program'), function(req, res) {
    Promise.all([
        Program.find({
            where: { id: req.params.id },
            include: [{model: OOS, as: 'OOS'}]
        }),
        Program.findAll({ where: {hidden: false}, order: 'name ASC' })
    ]).then(function(results) {
        res.render('programs/program', {
            title: 'PJ 2015 Program - ' + results[0].name,
            program: results[0],
            all_programs: results[1],
        });
    }).catch(function(error) {
        debug(error);
        res.send(500);
    });
});

router.post('/:id', role.can('edit program'), passwordless.restricted({
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

router.get('/:id/edit', role.can('edit program'), passwordless.restricted({
    failureRedirect: '/login',
    originField: 'origin'
}), function(req, res) {
    Program.find({
        where: { id: req.params.id }
    }).then(function(program) {
        res.render('programs/program_edit', {
            title: 'PJ 2015 Progarm - Edit Program Record',
            program: program
        });
    });
});

router.get('/:id/oos/csv',  function(req, res) {
    Program.find({
        where: { id: req.params.id },
        include: [{model: OOS, as: 'OOS'}]
    }).then(function(record) {
        var data = '';
        var stringifier = csv.stringify();
        var program_name = record.full_name_text.toLowerCase().replace(/ /g, '_');
        var filename = program_name + '_oos_list.csv';

        stringifier.on('readable', function() {
            while(row = stringifier.read()) {
                data += row;
            }
        });

        stringifier.on('error', function(err) {
            consol.log(err.message);
        });

        stringifier.on('finish', function() {
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', 'video/quicktime');
            res.send(data);
        });

        stringifier.write([ 'oos number', 'first name', 'last name', 'email address', 'phone number', 'cell phone' ]);
        record.OOS.forEach(function(oos) {
            stringifier.write([ oos.oos_number, oos.first_name, oos.last_name, oos.email, oos.phone, oos.cell_phone ]);
        });
        stringifier.end();

    });
});

module.exports = router;