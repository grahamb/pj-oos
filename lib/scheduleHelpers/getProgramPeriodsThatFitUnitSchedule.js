'use strict';
var moment = require('moment');
require('moment-range');

// Takes in a Unit object, and an array of ProgramPeriod objects
// Returns an array of the PeriodObjects that do not overlap with
//  the ProgramPeriods on the Unit's schedule (unit.ProgramPeriods)

module.exports = function(unit, periods) {

  // get the Unit's schedule
  var unitSchedule = unit.ProgramPeriods.map(function(p) {
    return p;
  });
  var scheduleItem, scheduleItemRange;

  while (unitSchedule.length > 0) {
    scheduleItem = unitSchedule.shift();
    scheduleItemRange = moment().range(scheduleItem.start_at, scheduleItem.end_at);
    periods = periods.filter(function(period) {
      var periodRange = moment().range(period.start_at, period.end_at);
      return !periodRange.overlaps(scheduleItemRange);
    });
  }
  return periods;
};
