'use strict';

module.exports = function(unit, program_id){
  var periods = unit.ProgramPeriods.filter(function(period) {
    return period.Program.id === program_id;
  });
  return periods.length ? periods : false;
};
