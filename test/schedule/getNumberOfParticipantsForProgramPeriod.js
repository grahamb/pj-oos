'use strict';
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var getNumberOfParticipantsForProgramPeriod = require('../../lib/scheduleHelpers/getNumberOfParticipantsForProgramPeriod');

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


describe('Get Number of Participants for a ProgramPeriod', function() {

  it('should return 43 for programPeriods[0]', function(done) {
    getNumberOfParticipantsForProgramPeriod(programPeriods[0]).should.equal(43);
    done();
  });

  it('should return 0 for programPeriods[4]', function(done) {
    getNumberOfParticipantsForProgramPeriod(programPeriods[4]).should.equal(0);
    done();
  });

});