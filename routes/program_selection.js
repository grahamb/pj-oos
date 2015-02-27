var express = require('express');
var router = express.Router();
var models = require('../models');
var shuffle = require('knuth-shuffle').knuthShuffle;
var sequelize = models.sequelize;

var getProgramsForUnitWithSelection = function(selection) {
  // need to do this as a raw query to get the ordering right
  var sql = 'select "Programs"."id", "Programs"."name", "Programs"."short_name", "Programs"."premium_activity" from "Programs" where hidden=false order by idx(array[' + selection.join(',') + '], "Programs"."id")';
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
    var unit_id = req.session.user.source_id;
    var g_unit;
    models.Unit.find({
      where: {
        id: unit_id
      },
      include: [models.ProgramSelection]
    }).then(function(unit) {
      req.session.program_selection_id = unit.ProgramSelection.id;
      g_unit = unit;

      if (unit.ProgramSelection && unit.ProgramSelection.program_selection.length > 0) {
        return getProgramsForUnitWithSelection(unit.ProgramSelection.program_selection);
      } else {
        return getProgramsForUnitWithouSelection();
      }

    }).then(function(programs) {
      var selection = g_unit.ProgramSelection.toJSON();
      selection.programs = programs.map(function(p) { return p.toJSON() });
      res.render('program_selection/selection_unit', {
        unit: g_unit,
        programs: programs,
        selection: selection,
        title: '- Program Selection for ' + g_unit.unit_name + ' (' + g_unit.unit_number + ')'
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

router.get('/:id', role.isAny(['admin', 'hq staff']), function(req, res) {
  var g_selection;

  models.ProgramSelection.find({
    where: {
      id: parseInt(req.params.id)
    },
    include: [models.Unit]
  }).then(function(results) {
    if (!results) {
        res.status(404).render(404);
        return false;
    }
    g_selection = results;
    return results;
  }).then(function(selection) {
    return getProgramsForUnitWithSelection(selection.program_selection);
  }).then(function(programs) {
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

  // TODO handle errors
  // TODO handle the final "locked" submit - redirect after?
  // TODO differentiate between ajax/non-ajax requests

  if (req.session.user.role === 'unit leader' && (req.session.program_selection_id != req.params.id)) {
    res.send(403);
    return false;
  }

  models.ProgramSelection.update(req.body, {
    returning: true,
    where: { id: req.params.id },
  }).then(function(results) {
    res.send(results[1][0].toJSON());
  }).catch(function(error) {
      console.log(error);
      res.render('error');
    });
});

module.exports = router;
