'use strict';

/* chooses a program period (`periods) from a given array using one of the following algorithms (`how`):
    - random (DEFAULT): returns a random program period
    - firstInResult: simply returns programs[0], where the array order is that returned by the database
    - lastInResult: simply returns programs[programs.length-1]
    - firstInTime: sorts the program periods by their start_at time and returns the first
    - lastInTime: sorts the program periods by their start_at and returns the last
    - mostParticipants: sorts the program periods by the number of participants assigned to each and returns the most-full
    - leastParticipants: sorts the program periods by the number of participants assigned to each and returns the least-full
*/

var getNumberOfParticipantsForProgramPeriod = require('./getNumberOfParticipantsForProgramPeriod');

var pickers = {

  random: function(periods) {
    return periods[Math.floor(Math.random()*periods.length)];
  },

  firstInResult: function(periods) {
    return periods[0];
  },

  lastInResult: function(periods) {
    return periods[periods.length-1];
  },

  firstInTime: function(periods) {
    var arr = periods.map(function(p) { return p; });
    var sorter = function(a, b) {
      return a.start_at.getTime() - b.start_at.getTime();
    }
    return arr.sort(sorter)[0];
  },

  lastInTime: function(periods) {
    var arr = periods.map(function(p) { return p; });
    var sorter = function(a, b) {
      return b.start_at.getTime() - a.start_at.getTime();
    }
    return arr.sort(sorter)[0];
  },

  mostParticipants: function(periods) {
    var arr = periods.map(function(p) { return p; });
    var sorter = function(a, b) {
      return getNumberOfParticipantsForProgramPeriod(b) - getNumberOfParticipantsForProgramPeriod(a);
    };
    return arr.sort(sorter)[0];
  },

  leastParticipants: function(periods) {
    var arr = periods.map(function(p) { return p; });
    var sorter = function(a, b) {
      return getNumberOfParticipantsForProgramPeriod(a) - getNumberOfParticipantsForProgramPeriod(b);
    };
    return arr.sort(sorter)[0];
  }

};

var chooseProgramPeriod = function(periods, how) {
  how = how || 'random';
  return pickers[how](periods);
};

module.exports = chooseProgramPeriod;