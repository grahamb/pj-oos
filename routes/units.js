var express = require('express');
var router = express.Router();
var models = require('../models');
var Unit = models.Unit, ProgramSelection = models.ProgramSelection, Login = models.Login, ProgramPeriod = models.ProgramPeriod;
var Promise = require('sequelize').Promise;
var role = require('connect-acl')(require('../lib/roles'));
var email = require('../lib/email');
var csv = require('csv');
var moment = require('moment');
var sequelize = models.sequelize;

var program_selection_status_icon_helper = function(selection) {
  var tmpl = '<i class="fa fa-ICON" title="TITLE"></i>';
  var icons = {
    locked: { icon: 'lock', title: 'Locked' },
    unlocked: { icon: 'unlock-alt', title: 'Not Locked'},
    not_started: { icon: 'minus', title: 'Not Started' }
  };
  var icon;

  if (!selection.program_selection.length) {
    icon = icons.not_started
  } else if (selection.locked) {
    icon = icons.locked;
  } else {
    icon = icons.unlocked
  }

  return tmpl.replace('ICON', icon.icon).replace('TITLE', icon.title);
};

var check_or_x = function(data) {
  var tmpl = '<i class="fa fa-ICON" title="TITLE"></i>';
  var ret = data ? {icon: 'check', title: 'true'} : {icon: 'times', title: 'false'}
  return tmpl.replace('ICON', ret.icon).replace('TITLE', ret.title);
};


router.get('/', role.can('view unit'), function(req, res) {
  var where = {};
  if (req.query.import_id) {
    where.import_id = req.query.import_id;
  }
  Unit.findAll({
    where: where,
    order: 'unit_number ASC',
    include: [ProgramSelection, Login]
  }).then(function(units) {

    if (req.xhr) {
      res.status(200).end(JSON.stringify(units));
      return;
    }

    res.render('units/index', {
      units: units,
      title: '- Unit Listing',
      helpers: {
        program_selection_status_icon_helper: program_selection_status_icon_helper,
        check_or_x: check_or_x
      }
    });
  }).catch(function(error) {
    console.log(error);
    res.status(500).end();
  });
});

router.get('/create', role.can('edit unit'), function(req, res) {
  res.render('units/unit_edit', {
    title: '- Create New Unit',
    unit: {}
  });
});

router.get('/edit', role.can('edit unit'), function(req, res) {
  res.render('units/units_bulk_edit', {
    title: ' - Edit Units',
    body_scripts: ['/dist/unit_bulk_edit_table.js']
  })
});

router.get('/csv', role.can('view unit'), function(req, res) {

  Unit.findAll({
    order: 'unit_number ASC',
  }).then(function(records) {
    var data = '';
    var stringifier = csv.stringify();
    var filename = 'units-' + moment().format("YYYYMMDDHHmmss") + '.csv';
    stringifier.on('readable', function() {
      while(row = stringifier.read()) {
        data += row;
      }
    });

    stringifier.on('error', function(err) {
      console.log(err.message);
    });

    stringifier.on('finish', function() {
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', 'text/csv');
      res.send(data);
    });

    stringifier.write([ 'unit_number', 'number_of_youth', 'number_of_leaders', 'contact_first_name', 'contact_last_name', 'contact_email', 'unit_name'  ]);
    records.forEach(function(unit) {
      stringifier.write([ unit.unit_number, unit.number_of_youth, unit.number_of_leaders, unit.contact_first_name, unit.contact_last_name, unit.contact_email, unit.unit_name ]);
    });
    stringifier.end();
  }).catch(console.log);
});

router.get('/:id', role.can('view unit'), function(req, res) {
  var sql, program_query;

  Unit.find({
    where: {
      id: req.params.id
    },
    include: [ProgramSelection, Login]
  }).then(function(unit) {
    if (!unit) {
      res.status(404).render(404);
      return false;
    }

    if (unit.ProgramSelection.program_selection.length) {
      sql = 'select "Programs"."id", "Programs"."name", "Programs"."short_name", "Programs"."premium_activity" from "Programs" where hidden=false and auto_assign=false order by idx(array[' + unit.ProgramSelection.program_selection.join(',') + '], "Programs"."id")';
      program_query = sequelize.query(sql, models.Program, {type: sequelize.QueryTypes.SELECT });
    } else {
      program_query = Promise.resolve();
    }

    program_query.then(function(programs) {
      res.render('units/unit', {
        unit: unit,
        title: '- ' + unit.unit_name + ' (' + unit.unit_number + ')',
        programs: programs,
        helpers: {
          program_selection_status_icon_helper: program_selection_status_icon_helper,
          check_or_x: check_or_x
        }
      });
    });

  }).catch(function(error) {
    console.log(error);
    res.status(500).end();
  });
});

router.post('/:id?', role.can('edit unit'), function(req, res) {
  if (req.params.id) {
    req.body.id = req.params.id;
  }
  var unit_number = req.body.unit_number;

  Unit.upsert(req.body, {
    fields: Object.keys(req.body)
  }).then(function(created) {
    Unit.find({
      where: {
        unit_number: unit_number
      },
      include: [models.ProgramSelection]
    }).then(function(unit) {
      if (created) {
        unit.createProgramSelection();
      }
      if (req.xhr) {
        res.status(200).end('ok');
      } else {
        res.redirect('/units/' + unit.id);
      }
    });
  }).catch(function(error) {
    console.log(error);
    res.render('error', { error: error });
  });

});

router.get('/:id/edit', role.can('edit unit'), function(req, res) {
  Unit.find({
    where: {
      id: req.params.id
    },
    include: [ProgramSelection]
  }).then(function(unit) {
    if (!unit) {
      res.status(404).render(404);
      return false;
    }

    res.render('units/unit_edit', {
      unit: unit,
      title: '- ' + unit.unit_name + ' (' + unit.unit_number + ')'
    });

  }).catch(function(error) {
    console.log(error);
    res.status(500).end();
  });

});

router.get('/:id/delete', role.can('edit oos'), function(req, res) {
  Unit.find({
    where: {
      id: req.params.id
    },
    include: [ProgramSelection]
  }).then(function(record){
    record.destroy().then(function() {
      if (req.xhr) {
        res.status(200).end('ok');
      } else {
        req.flash('success', 'Deleted ' + record.unit_Name + ' (Unit #' + record.unit_number + ')');
        res.redirect('/units');
      }
    });
  }).catch(function(error) {
    console.log(error);
    res.status(500).end();
  });
});

module.exports = router;