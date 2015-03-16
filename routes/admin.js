var express = require('express');
var router = express.Router();
var models = require('../models');
var Import = models.Import, OOS = models.OOS, Program = models.Program, Login = models.Login, Unit = models.Unit;
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
  var g_import_id;
  switch (req.body.import_type) {
    case 'oos':
    importers.oos(req.files.import_file).then(function(results) {
      results = results.filter(function(e) { return e !== null; });
      res.redirect('/oos?import_id=' + results[0].import_id);
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


router.get('/logins/toggle_unit/:id', function(req, res) {
  Unit.find({
    where: { id: req.params.id },
    include: [Login]
  }).then(function(unit) {
    if (!unit) {
      res.status(404).render(404);
      return false;
    }
    var op;
    var referer = req.headers.referer;

    if (unit.Login) {
      var currentLoginStatus = unit.Login.enabled;
      op = unit.Login.update({enabled: !unit.Login.enabled});
    } else {
      op = unit.createLogin({
        enabled: true,
        email: unit.contact_email,
        role: 'unit leader'
      });
    }

    op.then(function() {
      if (referer) {
        res.redirect(referer);
      } else {
        res.status(200).end('ok');
      }
    }).catch(function(error) {
      console.log(error);
      res.status(500).end();
    });

  })

});


module.exports = router;
