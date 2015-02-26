var express = require('express');
var router = express.Router();
var models = require('../models');
var shuffle = require('knuth-shuffle').knuthShuffle;
var sequelize = models.sequelize;

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
      var query;
      g_unit = unit;

      // if unit has selection, use it for the query
      if (unit.ProgramSelection && unit.ProgramSelection.program_selection.length > 0) {
        // need to do this as a raw query to get the ordering right
        var sql = 'select "Programs"."id", "Programs"."name", "Programs"."short_name", "Programs"."premium_activity" from "Programs" where hidden=false order by idx(array[' + unit.ProgramSelection.program_selection.join(',') + '], "Programs"."id")';
        var query = sequelize.query(sql, models.Program, {type: sequelize.QueryTypes.SELECT })

      // if unit has no selection, find all programs and shuffle them
      } else {
        query = models.Program.findAll({
          where: {
            hidden: false
          },
          attributes: ['id', 'name', 'short_name', 'premium_activity']
        }).then(function(programs) {
          var shuffled = shuffle(programs.slice(0));
          return shuffled;
        });
      }
      return query;
    }).then(function(programs) {
      res.render('program_selection/selection', {
        unit: g_unit,
        programs: programs
      });
    }).catch(console.error);
  } else {
    models.ProgramSelection.findAll({
      order: 'id ASC',
      include: [models.Unit]
    }).then(function(selections) {
      console.log(selections);
      res.render('program_selection/index', {
        selections: selections
      });
    });
  }

});

router.get('/:id', role.isAny(['admin', 'hq staff']), function(req, res) {
  /*
    - find the program selection, include program model
    - render template
   */
});

router.get('/:id/edit', role.isAny(['admin', 'hq staff']), function(req, res) {
  /*
    - find the program selection
    - render the same template as '/' for unit leader
   */
});

router.post('/:id', role.isAny(['admin', 'hq staff', 'unit leader']), function(req, res) {
  /*
    need to make sure that if the user's role is 'unit leader', they can only POST to their own program selection
   */
});

module.exports = router;
