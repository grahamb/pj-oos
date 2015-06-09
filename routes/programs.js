var express = require('express');
var router = express.Router();
var models = require('../models');
var Program = models.Program, OOS = models.OOS;
var passwordless = require('passwordless');
var role = require('connect-acl')(require('../lib/roles'));
var Promise = require('sequelize').Promise;
var csv = require('csv');
var moment = require('moment');

router.get('/', role.can('view program'), function(req, res) {
  Program.findAll({ where: {hidden: false}, order: 'premium_activity DESC, name ASC' }).then(function(programs) {
    res.render('programs/program', {
      title: '- All Programs',
      all_programs: programs
    });
  });
});

router.get('/oos', passwordless.restricted({ failureRedirect: '/login', originField: 'origin' }), role.isAny(['admin', 'hq staff']), function(req, res) {
  Program.findAll({ order: 'id ASC', where: { hidden: false }, include: [{model: OOS, as: 'OOS'}] }).then(function(programs) {
    res.render('programs/oos_count', {
      title: '- Program OOS Count',
      programs: programs
    });
  });
});

router.get('/pals', passwordless.restricted({ failureRedirect: '/login', originField: 'origin' }), role.isAny(['admin', 'hq staff']), function(req, res) {
  Program.findAll({ order: 'id ASC', where: { hidden: false }, include: [{model: OOS, as: 'OOS'}, {model: OOS, as: 'ProgramActivityLeader'}] }).then(function(results) {
    var programs = { offsite: [], onsite: [] };
    results.forEach(function(result) { console.log(result.dataValues.location); programs[result.dataValues.location].push(result); });
    res.render('programs/pals', {
      title: '- Program PALs',
      programs: programs
    });
  });
});

router.get('/:id', role.can('view program'), function(req, res) {
  Promise.all([
    Program.find({
      where: { id: req.params.id },
      include: [{model: OOS, as: 'OOS'}, {model: OOS, as: 'ProgramActivityLeader'}],
      order: [[ { model: OOS, as: 'OOS' }, 'oos_number' ]]
    }),
    Program.findAll({ where: {hidden: false}, order: 'premium_activity DESC, name ASC' })
    ]).then(function(results) {
      if (!results[0]) {
        res.status(404).render(404);
        return false;
      }
      res.render('programs/program', {
        title: '- ' + results[0].name,
        program: results[0],
        all_programs: results[1],
      });
    }).catch(function(error) {
      console.log(error);
      res.status(500).end();
    });
  });

router.post('/:id', role.can('edit program'), passwordless.restricted({
  failureRedirect: '/login',
  originField: 'origin'
}), function(req, res) {
  Program.find({
    where: { id: req.params.id }
  }).then(function(record) {
    if (!record) {
      res.status(404).render(404);
      return false;
    }
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
    where: { id: req.params.id },
    include: [{model: OOS, as: 'OOS'}, {model: OOS, as: 'ProgramActivityLeader'}]
  }).then(function(program) {
    res.render('programs/program_edit', {
      title: '- Edit Program Record',
      program: program,
      body_scripts: ['/dist/program_edit.js']
    });
  });
});

router.get('/:id/oos/csv', function(req, res) {
  Program.find({
    where: { id: req.params.id },
    include: [{model: OOS, as: 'OOS'}]
  }).then(function(record) {
    if (!record) {
      res.status(404).render(404);
      return false;
    }
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
      res.setHeader('Content-type', 'text/csv');
      res.send(data);
    });

    stringifier.write([ 'oos number', 'first name', 'last name', 'email address', 'phone number', 'cell phone', 'birthdate', 'current age' ]);
    record.OOS.forEach(function(oos) {
      stringifier.write([ oos.oos_number, oos.first_name, oos.last_name, oos.email, oos.phone, oos.cell_phone, moment(oos.dob).format('YYYY/MM/DD'), oos.current_age ]);
    });
    stringifier.end();

  });
});

router.get('/:id/schedule', role.can('view schedule'), function(req, res) {
  models.ProgramPeriod.findAll(
    { where: { program_id: req.params.id },
    order: ['start_at', [ {model: models.Unit}, 'unit_number']],
    include: [{all: true}]
  }).then(function(periods) {
    var program = periods[0].Program;
    res.render('programs/schedule', {
      program: program,
      periods: periods,
      title: ' - Program Schedule - ' + program.full_name_text,
      helpers: {
        total_participants: function(units) {
          if (!units.length) { return 0; }
          return units.map(function(unit) {
            return unit.number_of_youth + unit.number_of_leaders;
          }).reduce(function(previous, current) {
            return previous + current;
          });
        },
        number_of_leaders: function(units) {
          if (!units.length) { return 0; }
          return units.map(function(unit) {
            return unit.number_of_leaders;
          }).reduce(function(previous, current) {
            return previous + current;
          });
        },
        number_of_youth: function(units) {
          if (!units.length) { return 0; }
          return units.map(function(unit) {
            return unit.number_of_youth;
          }).reduce(function(previous, current) {
            return previous + current;
          });
        },
        remaining_space: function(period, units) {
          if (!units.length) { return period.Program.max_participants_per_period; }
          const total = units.map(function(unit) {
            return unit.number_of_youth + unit.number_of_leaders;
          }).reduce(function(previous, current) {
            return previous + current;
          });
          return period.Program.max_participants_per_period - total;
        },

      }
    });
  })
});

router.get('/:id/schedule.csv', role.can('view schedule'), function(req, res) {
  models.ProgramPeriod.findAll(
    { where: { program_id: req.params.id },
    order: ['start_at', [ {model: models.Unit}, 'unit_number']],
    include: [{all: true}]
  }).then(function(periods) {
    var data = '';
    var stringifier = csv.stringify();
    var filename = `program-${req.params.id}-schedule-${moment().format("YYYYMMDDHHmmss")}.csv`;
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

    stringifier.write('program_period unit_number unit_name contact_leader_name contact_leader_email number_of_scouts number_of_leaders'.split(' '));
    periods.forEach(function(period) {
      var start_at = moment(period.start_at).format('dddd MMMM DD HH:mm');
      period.Units.forEach(function(u) {
        stringifier.write([start_at, u.unit_number, u.unit_name, u.contact_name, u.contact_email, u.number_of_youth, u.number_of_leaders]);
      });
    });
    stringifier.end();
  }).catch(function(error) {
    console.log(error);
    res.status(500).end();
  });
});

module.exports = router;
