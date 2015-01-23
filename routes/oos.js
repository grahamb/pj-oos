var express = require('express');
var router = express.Router();
var models = require('../models');
var OOS = models.OOS, Program = models.Program;
var QueryChainer = require('sequelize').Utils.QueryChainer;
var role = require('connect-acl')(require('../lib/roles'));

function find_by_id(id) {
    return OOS.find({
        where: {id: id},
        include: [ Program ]
    });
}

router.get('/', role.can('view oos'), function(req, res) {
    var assignmentFilter = {};
    var where = {};

    if (req.query.program && (!isNaN(req.query.program))) {
        assignmentFilter.id = req.query.program;
    }

    if (req.query.import_id) {
        where.import_id = req.query.import_id;
    }

    var chainer = new QueryChainer;
    chainer
        .add(Program.findAll({
            order: 'id ASC'
        }))
        .add(OOS.findAll({
            where: where,
            include: [ { model: Program, where: assignmentFilter } ],
            order: 'oos_number ASC'
        }))
        .run()
        .success(function(results) {
            res.render('oos/index', {
                title: 'PJ 2015 Program - OOS Listing',
                programs: results[0],
                oos: results[1]
            });
        })
        .error(function(err) {
            console.log(err);
            res.render('error');
        });
});

router.get('/:id', role.can('view oos'), function(req, res) {
    find_by_id(req.params.id).then(function(record) {
        res.render('oos/oos', {
            oos: record,
            title: 'PJ 2015 Program - OOS - ' + record.first_name + ' ' + record.last_name
        });
    });
});

router.post('/:id', role.can('edit oos'), function(req, res) {
    var data = req.body;
    var program_id = parseInt(data.program_id);
    delete data.program_id;

    var chainer = new QueryChainer;

    var findProgram = function(program_id) {
        return Program.find({where: {id: program_id}});
    };

    var updateOOSRecord = function(record, data) {
        return record.updateAttributes(data, { fields: Object.keys(data) });
    };

    var updateOOSProgramAssignment = function(record, program) {
        return record.setPrograms([program]);
    };

    var success = function() {
        if (req.xhr) {
            res.status(200).end();
        } else {
            res.redirect('/oos/' + req.params.id);
        }
    };

    var failure = function(err) {
        console.log(err);
        res.render('error');
    };

    find_by_id(req.params.id).then(function(record) {

        // if program assignment has changed, then find the new program
        // and update both the OOS record and the program assignment
        if (record.Programs[0].id !== program_id) {
            findProgram(program_id).then(function(program) {
                chainer.add(updateOOSProgramAssignment(record, program));
                chainer.add(updateOOSRecord(record, data));
                chainer.run().then(success).catch(failure);
            });

        // only updating the assignment (for the quick assignment thing)
        } else if (!(Object.keys(data).length)) {
            findProgram(program_id).then(function(program) {
                updateOOSProgramAssignment(record, program).then(success).catch(failure);
            });

        // otherwise, only update the record
        } else {
            updateOOSRecord(record, data).then(success).catch(failure);
        }
    });
});

router.get('/:id/edit', role.can('edit oos'), function(req, res) {
    var chainer = new QueryChainer;
    chainer
        .add(models.Program.all({ order: 'id ASC'}))
        .add(find_by_id(req.params.id))
        .run()
        .success(function(results) {
            res.render('oos/oos_edit', {
                programs: results[0],
                oos: results[1],
                title: 'PJ 2015 Program - OOS - Edit'
            });
        });
});

module.exports = router;
