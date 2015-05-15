'use strict';

module.exports = function(period) {
  var mapped = period.Units.map(function(x) {
    return x.number_of_youth + x.number_of_leaders;
  });
  return mapped.length ? mapped.reduce(function(previousValue, currentValue) {
    return previousValue + currentValue;
  }) : 0;
};
