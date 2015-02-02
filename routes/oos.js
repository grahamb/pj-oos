var express = require('express');
var router = express.Router();
var models = require('../models');
var OOS = models.OOS, Program = models.Program;
var Promise = require('sequelize').Promise;
var role = require('connect-acl')(require('../lib/roles'));
var QueryChainer = require('sequelize').Utils.QueryChainer;
var email = require('../lib/email');

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

    Promise.all([
        Program.findAll({ order: 'id ASC' }),
        OOS.findAll({
            where: where,
            include: [ { model: Program, where: assignmentFilter } ],
            order: 'oos_number ASC'
        })
    ]).then(function(results) {
        res.render('oos/index', {
            title: 'PJ 2015 Program - OOS Listing',
            programs: results[0],
            oos: results[1],
            messages: req.flash()
        });
    }).catch(function(error) {
        console.log(error);
        res.render('error');
    })
});

router.get('/:id', role.can('view oos'), function(req, res) {
    find_by_id(req.params.id).then(function(record) {
        if (!record) { res.status(404).render(404); } else {

            res.render('oos/oos', {
                oos: record,
                title: 'PJ 2015 Program - OOS - ' + record.first_name + ' ' + record.last_name
            });
        }
    }).catch(function(error) {
        degug(error);
        res.send(500)
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

        if (!record) {
            res.status(404).render(404);
            return false;
        }

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

router.get('/:id/send_welcome_email', role.is('admin'), function(req, res) {
    OOS.find({
        where: {id: req.params.id}
    }).then(function(record) {

        if (!record) {
            res.status(404).render(404);
            return false;
        }

        email.send('oos_welcome', {
            to: record.email,
            from: 'hello+pjprogram@grahamballantyne.com',
            bcc: ['hello@grahamballantyne.com'],
            fromname: 'Graham Ballantyne (PJ 2015)',
            subject: 'PJ 2015 Program Offer of Service Assignment (' + record.first_name + ' ' + record.last_name + ' - OOS #' + record.oos_number + ')'
        }, function(err, result) {
            if (err) {
                debug(err);
                res.redirect(500);
                return false;
            }
            if (req.xhr) {
                res.status(200).end();
            } else {
                res.redirect('/oos/' + req.params.id);
            }
        });
    });
});

router.get('/:id/delete', role.can('edit oos'), function(req, res) {
    OOS.find(req.params.id).then(function(record){
        record.destroy().then(function() {
            req.flash('success', 'Deleted ' + record.first_name + ' ' + record.last_name + ' (OOS #' + record.oos_number + ')');
            res.redirect('/oos');
        });
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
