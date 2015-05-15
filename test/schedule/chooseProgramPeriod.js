'use strict';
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var chooseProgramPeriod = require('../../lib/scheduleHelpers/chooseProgramPeriod');

var programPeriods = [
  {
    id: 1,
    "start_at": new Date("2015-07-15T16:00:00.000Z"),
    "end_at": new Date("2015-07-15T23:30:00.000Z"),
    "Units": [ // 43
    { number_of_youth: 8, number_of_leaders: 2},
    { number_of_youth: 8, number_of_leaders: 2},
    { number_of_youth: 8, number_of_leaders: 2},
    { number_of_youth: 6, number_of_leaders: 2},
    { number_of_youth: 3, number_of_leaders: 2},
    ]
  },

  {
    id: 2,
    "start_at": new Date("2015-07-14T16:00:00.000Z"),
    "end_at": new Date("2015-07-14T23:30:00.000Z"),
    "Units": [ // 50
    { number_of_youth: 8, number_of_leaders: 2},
    { number_of_youth: 8, number_of_leaders: 2},
    { number_of_youth: 8, number_of_leaders: 2},
    { number_of_youth: 6, number_of_leaders: 2},
    { number_of_youth: 3, number_of_leaders: 2},
    { number_of_youth: 5, number_of_leaders: 2}
    ]
  },

  {
    id: 3,
    "start_at": new Date("2015-07-17T16:00:00.000Z"),
    "end_at": new Date("2015-07-17T23:30:00.000Z"),
    "Units": [ // 30
    { number_of_youth: 8, number_of_leaders: 2},
    { number_of_youth: 8, number_of_leaders: 2},
    { number_of_youth: 8, number_of_leaders: 2},
    ]
  },

  {
    id: 4,
    "start_at": new Date("2015-07-16T16:00:00.000Z"),
    "end_at": new Date("2015-07-16T23:30:00.000Z"),
    "Units": [] // 0
  },

  {
    id: 5,
    "start_at": new Date("2015-07-13T16:00:00.000Z"),
    "end_at": new Date("2015-07-13T23:30:00.000Z"),
    "Units": []
  },
];

describe('Choose Program Period', function() {

  it('should return a random ProgramPeriod', function(done) {
    var period = chooseProgramPeriod(programPeriods, 'random');
    period.should.have.property('start_at');
    done();
  });

  it('should return the first ProgramPeriod in the array', function(done) {
    var start_at = chooseProgramPeriod(programPeriods, 'firstInResult').start_at.getTime();
    start_at.should.equal(programPeriods[0].start_at.getTime());
    done();
  });

  it('should return the last ProgramPeriod in the array', function(done) {
    var start_at = chooseProgramPeriod(programPeriods, 'lastInResult').start_at.getTime();
    start_at.should.equal(programPeriods[programPeriods.length-1].start_at.getTime());
    done();
  });

  it('should return the earliest ProgramPeriod in date order', function(done) {
    var period = chooseProgramPeriod(programPeriods, 'firstInTime');
    period.start_at.getTime().should.equal(new Date("2015-07-13T16:00:00.000Z").getTime());
    done();
  });

  it('should return the latest ProgramPeriod in date order', function(done) {
    var period = chooseProgramPeriod(programPeriods, 'lastInTime');
    period.start_at.getTime().should.equal(new Date("2015-07-17T16:00:00.000Z").getTime());
    done();
  });

  it('should return the ProgramPeriod with the most number of participants', function(done) {
    var period = chooseProgramPeriod(programPeriods, 'mostParticipants');
    period.id.should.equal(2);
    done();
  });

  it('should return the ProgramPeriod with the least number of participants', function(done) {
    var period = chooseProgramPeriod(programPeriods, 'leastParticipants');
    period.id.should.equal(4);  // both 4 and 5 have 0 participants, but 4 is first in the array
    done();
  });

});