var express = require('express');
var router = express.Router();
var models = require('../models');
var Import = models.Import, OOS = models.OOS, Program = models.Program;
var path = require('path');
var Promise = require('sequelize').Promise;
var fs = require('fs');
var importers = require('../lib/importers');

role = require('connect-acl')(require('../lib/roles'));

router.get('/import', role.is('admin'), function(req, res) {
  res.render('admin/import/csv_import', {
    title: '- Admin - Import CSV File'
  });
});


router.post('/import', role.can('import oos'), function(req, res) {

  switch (req.body.import_type) {
    case 'oos':
    importers.oos(req.files.import_file).then(function(results) {
      var import_id = results[0].import_id;
      res.redirect('/oos?import_id=' + import_id);
    }).catch(function(error) {
      console.log(error);
      res.status(500).end();
    });
    break;

    case 'unit':
    importers.unit(req.files.import_file).then(function(results) {
      var import_id = results[0].import_id;
      res.redirect('/units?import_id=' + import_id);
    }).catch(function(error) {
      console.log(error);
      res.status(500).end();
    });
    break;
  }



});

module.exports = router;
