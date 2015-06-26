var express = require('express');
var router = express.Router();
var passwordless = require('passwordless');
var requestTokenFn = require('../lib/passwordless/requestToken');
var models = require('../models');
var moment = require('moment');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/login', function(req, res) {
  res.render('login', {
    auth_message: req.flash('passwordless'),
    success_flash: req.flash('passwordless-success'),
    origin: req.query.origin,
    title: '- Login'
  });
});

router.post('/login',
  passwordless.requestToken(requestTokenFn, {
    failureRedirect: '/login',
    failureFlash: 'The email address you entered could not be found. Access to this site is restricted to PJ Program Staff, and registered Unit Leaders. If you are a Unit Leader, you will receive an email once your registration has been received from the PJ Registrar. For further assistance, please contact us at <a href="mailto:programselection@pj2015.ca">programselection@pj2015.ca</a>.',
    originField: 'origin',
    successFlash: 'Your sign in email has been sent. Please check your email for a message from programselection@pj2015.ca.'
  }),
  function(req, res) {
    res.redirect('/login');
  }
  );

router.get('/logout', passwordless.logout(), function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      debug(err);
    }
    res.redirect('/');
  });
});

router.get('/status', function(req, res) {
  models.Program.findAll({
    where: {
      hidden: false
    },
    include: [{
      model: models.ProgramPeriod, include: [{all:true}]
    }],
    order: ['id', [ {model: models.ProgramPeriod}, 'start_at']]
  }).then(function(programs) {
    // res.end(JSON.stringify(programs)); return;
    var data = programs.map(function(program) {
      var periods = program.ProgramPeriods;
      var data = {
        id: program.id,
        program: program,
      };

      data.periods = periods.map(function(period) {
        const units = period.Units;
        var available;

        if (!units.length) {
          available = period.Program.max_participants_per_period;
        } else {
          const total = units.map(function(unit) {
            return unit.number_of_youth + unit.number_of_leaders;
          }).reduce(function(previous, current) {
            return previous + current;
          });
          available = period.Program.max_participants_per_period - total;
        }

        return {
          start_at: moment(period.start_at).format('dd hA'),
          available: available,
          status: available < 0 ? 'red' : 'ok',
          max_per_period: program.max_participants_per_period
        }
      });
      return data;
    });
    console.log(data);
    res.render('status', {
      data: data,
      helpers: {
        offsite_icon(program) {
          if (program.location === 'Off-Site') {
            return '<i class="fa fa-bus"></i>';
          } else {
            return '';
          }
        }

      }
    });
  });
});

module.exports = router;
