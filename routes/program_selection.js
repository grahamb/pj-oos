var express = require('express');
var router = express.Router();
var models = require('../models');
var shuffle = require('knuth-shuffle').knuthShuffle;
var sequelize = models.sequelize;
var email = require('../lib/email');
var Promise = require('sequelize').Promise;

var getProgramsForUnitWithSelection = function(selection) {
  // need to do this as a raw query to get the ordering right
  var sql = 'select "Programs"."id", "Programs"."name", "Programs"."short_name", "Programs"."premium_activity" from "Programs" where hidden=false and auto_assign=false order by idx(array[' + selection.join(',') + '], "Programs"."id")';
  return sequelize.query(sql, models.Program, {type: sequelize.QueryTypes.SELECT });
};

var getProgramsForUnitWithouSelection = function() {
  // if unit has no selection, find all programs and shuffle them
  return models.Program.findAll({
    where: {
      hidden: false,
      auto_assign: false
    },
    attributes: ['id', 'name', 'short_name', 'premium_activity']
  }).then(function(programs) {
    var shuffled = shuffle(programs.slice(0));
    return shuffled;
  });
}


router.get('/', role.isAny(['admin', 'hq staff', 'unit leader']), function(req, res) {

  if (req.session.user.role === 'unit leader') {
    var leader_email = req.session.user.email;
    var g_unit;
    models.Unit.findAll({
      where: {
        contact_email: leader_email
      },
      include: [models.ProgramSelection]
    }).then(function(units) {

      if (!units.length) {
        res.status(404).render(404);
        return;
      }

      if (units.length === 1) {
        res.redirect('/program_selection/' + units[0].ProgramSelection.id);
        return;
      }

      res.render('program_selection/unit_leader_index', {
        units: units
      });

    }).catch(function(error) {
        console.log(error);
        res.render('error');
    });
  } else {
    models.ProgramSelection.findAll({
      order: 'id ASC',
      include: [models.Unit]
    }).then(function(selections) {
      res.render('program_selection/index', {
        selections: selections,
        title: '- Program Selections'
      });
    });
  }

});

router.get('/all', role.isAny(['admin', 'hq staff']), function(req, res) {

  models.Unit.findAll({
      order: ['final_payment_date', 'unit_number'],
      include: [
        {
          model: models.ProgramSelection,
          where: {
            locked: true
          }
        }
      ]
    }).then(function(units) {
      var promises = units.map(function(unit) {
        return getProgramsForUnitWithSelection(unit.ProgramSelection.program_selection);
      });
      Promise.all(promises).spread(function() {
        console.log('*****', arguments.length);
        for (var i = 0; i < arguments.length; i++) {
          units[i].PROGRAMS = arguments[i];
          units[i].ORDER = i+1;
        };
        console.log('rendering?');
        res.render('program_selection/all', {
          units: units,
          title: ' - Program Selections Ordered by Payment Date'
        });
      });
    });

});

router.get('/stats', role.isAny(['admin', 'hq staff', 'pal']), function(req, res) {
  // get count of program selections
  // find all locked program selections
  // summarize the data
  // render the template

  Promise.all([
    models.Program.findAll({ order: 'id ASC', where: { hidden: false }}),
    models.ProgramSelection.findAll({where: { locked: true }}),
    models.Unit.count()
  ]).spread(function(programs, program_selections, total_units) {

    // map ids to program names
    var programs_map = {};
    programs.forEach(function(p) {
      programs_map[p.id.toString()] = p.full_name_text;
    });

    // program selection stats
    var extra_free_period_true_count = program_selections.reduce(function(a,b) {
      var val = b.extra_free_period ? 1 : 0;
      return val + a;
    }, 0);

    var rankings = {};

    program_selections[0].program_selection.slice().sort(function(a,b) { return a-b }).forEach(function(p) {
      rankings[programs_map[p]] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    });

    program_selections.forEach(function(p, i, arr) {
        p.program_selection.forEach(function(program, i, arr) {
            var oldRank = rankings[programs_map[program]][i];
            rankings[programs_map[program]][i] = oldRank ? rankings[programs_map[program]][i] + 1 : 1;
        });
    });

    var bar_data = function(arr) {
        return arr.map(function(d, i) {
            return {
                label: (i+1)+'',
                value: d
            };
        });
    };

    var rankings_array = [];

    for (var i in rankings) {
        rankings_array.push({
          name: i,
          rankings: bar_data(rankings[i])
        });
    }

    res.render('program_selection/stats', {
      title: ' - Program Selection Stats',
      extra_free_period_true_count: extra_free_period_true_count,
      rankings: rankings_array,
      total_units: total_units,
      received_count: program_selections.length,
      body_scripts: ['/dist/program_selection_stats.js']
    });

  }).catch(function(error) {
      console.log(error);
      res.render('error');
  });
});

router.get('/:id', role.isAny(['admin', 'hq staff', 'unit leader']), function(req, res) {
  var g_selection;

  models.ProgramSelection.find({
    where: {
      id: parseInt(req.params.id)
    },
    include: [models.Unit]
  }).then(function(selection) {
    if (!selection) {
        res.status(404).render(404);
        return false;
    }

    if (req.session.user.role === 'unit leader' && (req.session.user.email !== selection.Unit.contact_email)) {
      res.status(403).end('nice try');
      return;
    }

    g_selection = selection;
    return selection;
  }).then(function(selection) {
    var unit = selection.Unit;
    if (selection && selection.program_selection.length > 0) {
      return getProgramsForUnitWithSelection(selection.program_selection);
    } else {
      return getProgramsForUnitWithouSelection();
    }
  }).then(function(programs) {
    if (req.session.user.role === 'unit leader') {
      var selection = g_selection.toJSON();
      selection.programs = programs.map(function(p) { return p.toJSON() });
      res.render('program_selection/selection_unit', {
        unit: selection.Unit,
        programs: programs,
        selection: selection,
        title: '- Program Selection for ' + selection.Unit.unit_name + ' (' + selection.Unit.unit_number + ')',
        body_scripts: ['/dist/program_selection.js']
      });
      return;
    }

    res.render('program_selection/selection_admin', {
      selection: g_selection,
      programs: programs,
      title: '- Program Selection for ' + g_selection.Unit.unit_name + ' (' + g_selection.Unit.unit_number + ')'
    });
  }).catch(function(error) {
    console.log(error);
    res.render('error');
  });

});

router.get('/:id/edit', role.isAny(['admin', 'hq staff']), function(req, res) {
   var g_selection;
   models.ProgramSelection.find({
    where: {
      id: parseInt(req.params.id)
    },
    include: [models.Unit]
  }).then(function(selection) {
    if (!selection) {
        res.status(404).render(404);
        return false;
    }
    g_selection = selection;
    return selection;
  }).then(function(selection) {
    var unit = selection.Unit;
    if (selection && selection.program_selection.length > 0) {
      return getProgramsForUnitWithSelection(selection.program_selection);
    } else {
      return getProgramsForUnitWithouSelection();
    }
  }).then(function(programs) {
    var selection = g_selection.toJSON();
    selection.programs = programs.map(function(p) { return p.toJSON() });
    res.render('program_selection/selection_edit', {
      unit: selection.Unit,
      programs: programs,
      selection: selection,
      title: '- Program Selection for ' + selection.Unit.unit_name + ' (' + selection.Unit.unit_number + ')',
      body_scripts: ['/dist/program_selection.js']
    });
  }).catch(function(error) {
    console.log(error);
    res.render('error');
  });

});

router.post('/:id', role.isAny(['admin', 'hq staff', 'unit leader']), function(req, res) {

  models.ProgramSelection.find({
    where: {
      id: parseInt(req.params.id)
    },
    include: [models.Unit]
  }).then(function(selection) {

    if (req.session.user.role === 'unit leader' && (req.session.user.email !== selection.Unit.contact_email)) {
      res.send(403);
      return false;
    }

    models.ProgramSelection.update(req.body, {
      returning: true,
      where: { id: req.params.id },
    }).then(function(results) {
      if (results[1][0].locked) {
        models.Unit.find({
          where: { id: results[1][0].unit_id },
          include: [models.ProgramSelection]
        }).then(function(unit) {
          var selection = unit.ProgramSelection.program_selection;
          getProgramsForUnitWithSelection(selection).then(function(programs) {
            email.program_selection_confirmation(unit, programs, res.locals.production, function(err, result) {
              if (err) {
                console.log(err);
                res.redirect(500);
                return false;
              }
              res.send(results[1][0].toJSON());
            });
          });
        });
      } else {
        res.send(results[1][0].toJSON());
      }
    });
  }).catch(function(error) {
    console.log(error);
    res.render('error');
  });
});

module.exports = router;
