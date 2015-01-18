var express = require('express');
var router = express.Router();
var models = require('../models');
var Import = models.Import;
var fs = require('fs');
var path = require('path');

role = require('connect-acl')(require('../lib/roles'));

router.get('/import/oos', role.can('import oos'), function(req, res) {
    res.render('admin/import/oos_import', {
        title: 'PJ 2015 Program - Admin - OOS - Import CSV File'
    });
});

router.post('/import/oos', role.can('import oos'), function(req, res) {
    console.log(req.body) // form fields
    console.log(req.files)
    Import.create({
        import_type: 'oos',
        status: 'new',
        name: req.files.import_file.name,
        path: path.join(process.cwd(), req.files.import_file.path),
        mimetype: req.files.import_file.mimetype,
        extension: req.files.import_file.extension,
        size: req.files.import_file.size
    }).success(function(result) {
        console.log(result);
        var id = result.id;
        res.redirect('/admin/import/oos/' + result.id);
    });
});

router.get('/import/oos/:id', role.can('import oos'), function(req, res) {
    Import.find(req.params.id).success(function(record) {
        if (!record) { res.send(404); return false; }
        fs.readFile(record.path, function(err, data) {
            if (err) {
                console.log(err);
                res.send(500);
                return false;
            }
            console.log(data);
            res.send(data.toString());
        });
    });
    // fs.readFile()
});

module.exports = router;
