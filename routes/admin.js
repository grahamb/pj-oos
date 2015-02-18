var express = require('express');
var router = express.Router();
var models = require('../models');
var Import = models.Import, OOS = models.OOS, Program = models.Program;
var path = require('path');
var csv = require('csv');
var Promise = require('sequelize').Promise;
var fs = require('fs');

role = require('connect-acl')(require('../lib/roles'));

function parse_csv_file(file) {
    return new Promise(function (resolve, reject) {
        var parser = csv.parse({delimiter: ',', columns: true, autoParse: true},
            function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
                parser.end();
            });
        fs.createReadStream(file).pipe(parser);
    });
}

router.get('/import/oos', role.can('import oos'), function(req, res) {
    res.render('admin/import/oos_import', {
        title: 'PJ 2015 Program - Admin - OOS - Import CSV File'
    });
});


// this is super gross but whatever, it works (I hope)
router.post('/import/oos', role.can('import oos'), function(req, res) {
    Import.create({
        import_type: 'oos',
        status: 'new',
        name: req.files.import_file.name,
        path: path.join(process.cwd(), req.files.import_file.path),
        mimetype: req.files.import_file.mimetype,
        extension: req.files.import_file.extension,
        size: req.files.import_file.size
    }).then(function(import_record) {
        var import_id = import_record.id;
        var import_path = import_record.path;

        parse_csv_file(import_path).then(function(csv_records) {
            var fields = Object.keys(csv_records);
            ['assigned_department', 'desired_assignment'].forEach(function(field) {
                fields.splice(fields.indexOf(field), 1);
            });

            var import_records = csv_records.map(function(record) {
                record.notes = record.assigned_department + '\n' + record.desired_assignment;
                record.import_id = import_id;
                return record;
            });

            return Promise.map(import_records, function(record) {
                return OOS.findOrCreate({
                    where: { oos_number: record.oos_number },
                    fields: fields,
                    defaults: record,
                    include: [Program]
                }).catch(function(error) {
                    console.log(error);
                    res.status(500).end();
                });

            }).spread(function() {

                // args is an array of [{record}, created]
                var args = Array.prototype.slice.call(arguments);
                var created_records = [];
                args.forEach(function(arr) {
                    var record = arr[0], created = arr[1];
                    if (created) {
                        created_records.push(record);
                    }
                });
                return Promise.map(created_records , function(record) {
                    console.log(record);
                    return record.setPrograms([0]);
                });
            }).then(function() {
                res.redirect('/oos?import_id=' + import_id);
            }).catch(function(error) {
                console.log(error);
                res.status(500).end();
            });

        }).catch(function(error) {
            console.log(error);
            res.status(500).end();
        });

    }).catch(function(error) {
        console.log(error);
        res.status(500).end();
    });
});

module.exports = router;
