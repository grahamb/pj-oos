'use strict';

module.exports = function(unit) {
  if (!unit.ProgramPeriods.length) { return 0; }
  var fp = unit.ProgramPeriods.filter(function(p) {
    return p.Program.id === 25;
  });
  return fp.length;
};
