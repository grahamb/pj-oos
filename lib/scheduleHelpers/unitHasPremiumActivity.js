'use strict';

module.exports = function(unit_schedule) {
  return unit_schedule.filter(function(p) {
    return p.Program.premium_activity;
  }).length
};
