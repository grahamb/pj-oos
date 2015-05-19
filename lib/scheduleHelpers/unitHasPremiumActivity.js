'use strict';

module.exports = function(unit_schedule) {
  var hasPremium = false;
  unit_schedule.forEach(function(p) {
    if (p.Program.premium_activity) {
      hasPremium = true;
    }
  });
  return hasPremium;
};
