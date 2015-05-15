'use strict';
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var partialUnitSchedule = require('./mockScheduleData').partialUnitSchedule;
var programPeriods = require('./mockProgramPeriodsInsufficientSpaceData').halfDayProgramPeriodsWithUnits;
var programPeriodsFull = require('./mockProgramPeriodsInsufficientSpaceData').halfDayProgramPeriodsAllFull;

var unitSize = 8;
var capacity = 50;

var filterOverlappingPeriods = require('../../lib/scheduleHelpers/filterOverlappingProgramPeriods');
var filterProgramPeriodsWIthInsufficentSpace = require('../../lib/scheduleHelpers/filterProgramPeriodsWIthInsufficentSpace');

describe('Find ProgramPeriods for Unit', function() {

  it('should return 7 ProgramPeriods that can fit unit and do not overlap when Program still has space', function(done) {
    var periods = filterProgramPeriodsWIthInsufficentSpace(unitSize, capacity, programPeriods);
    periods = filterOverlappingPeriods(partialUnitSchedule, periods);
    periods.should.have.length(7);
    done();
  });

  it('should return 0 ProgramPeriods that can fit unit and do not overlap when Program has no space', function(done) {
    var periods = filterProgramPeriodsWIthInsufficentSpace(unitSize, capacity, programPeriodsFull);
    periods = filterOverlappingPeriods(partialUnitSchedule, periods);
    periods.should.have.length(0);
    done();
  });

});