var express = require('express');
var router = express.Router();
var models = require('../models');
var shuffle = require('knuth-shuffle').knuthShuffle;
var sequelize = models.sequelize;

var getProgramsForUnitWithSelection = function(selection) {
  // need to do this as a raw query to get the ordering right
  var sql = 'select "Programs"."id", "Programs"."name", "Programs"."short_name", "Programs"."premium_activity" from "Programs" where hidden=false and auto_assign=false order by idx(array[' + selection.join(',') + '], "Programs"."id")';
  return sequelize.query(sql, models.Program, {type: sequelize.QueryTypes.SELECT });
};

var getProgramsForUnitWithouSelection = function() {
  // if unit has no selection, find all programs and shuffle them
  return models.Program.findAll({
    where: {
      hidden: false
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

    if (unit.ProgramSelection && unit.ProgramSelection.program_selection.length > 0) {
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
  /*
    - find the program selection
    - render the same template as '/' for unit leader
   */
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
      res.send(results[1][0].toJSON());
    })
  }).catch(function(error) {
    console.log(error);
    res.render('error');
  });
});

module.exports = router;
