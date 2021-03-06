'use strict';

module.exports = function(unitSize, periods) {
  return periods.filter(function(period) {
    if (!period.Units.length) { return true; }
    var currentLoading = period.Units.map(function(x) {
      return (x.number_of_youth + x.number_of_leaders)
    }).reduce(function(previous, current) {
      return previous + current
    });
    return (currentLoading + unitSize) <= period.Program.max_participants_per_period;
  });
};
