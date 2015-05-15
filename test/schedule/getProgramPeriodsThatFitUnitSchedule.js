'use strict';
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var mockData = require('./mockScheduleData');
var getProgramPeriodsThatFitUnitSchedule = require('../../lib/scheduleHelpers/getProgramPeriodsThatFitUnitSchedule');
var moment = require('moment');
require('moment-range');

describe('Filter Overlapping Periods', function() {

  it('should return 11 available half-day ProgramPeriods when given the empty Unit Schedule', function(done) {
    var periods = getProgramPeriodsThatFitUnitSchedule(mockData.emptyUnitSchedule, mockData.halfDayProgramPeriods);
    periods.should.have.length(11);
    done();
  });

  it('should return 5 available full-day ProgramPeriods when given the empty Unit Schedule', function(done) {
    var periods = getProgramPeriodsThatFitUnitSchedule(mockData.emptyUnitSchedule, mockData.fullDayProgramPeriods);
    periods.should.have.length(5);
    done();
  });

  it('should return 7 availble half-day ProgramPeriods when given the partial Unit Schedule', function(done) {
    var periods = getProgramPeriodsThatFitUnitSchedule(mockData.partialUnitSchedule, mockData.halfDayProgramPeriods);
    periods.should.have.length(7);
    done();
  });

  it('should return 2 available full-day ProgramPeriods when given the partial Unit Schedule', function(done) {
    var periods = getProgramPeriodsThatFitUnitSchedule(mockData.partialUnitSchedule, mockData.fullDayProgramPeriods);
    periods.should.have.length(2);
    done();
  });

  it('should return 0 available half-day ProgramPeriods when given the partial Unit Schedule', function(done) {
    var periods = getProgramPeriodsThatFitUnitSchedule(mockData.fullUnitSchedule, mockData.halfDayProgramPeriods);
    periods.should.have.length(0);
    done();
  });

  it('should return 0 available full-day ProgramPeriods when given the partial Unit Schedule', function(done) {
    var periods = getProgramPeriodsThatFitUnitSchedule(mockData.fullUnitSchedule, mockData.fullDayProgramPeriods);
    periods.should.have.length(0);
    done();
  });

  it('should only return 1 available half-day ProgramPeriods when given the partial Unit Schedule and limitedAvailabilityHalfDayProgramPeriods', function(done) {
    var periods = getProgramPeriodsThatFitUnitSchedule(mockData.partialUnitSchedule, mockData.limitedAvailabilityHalfDayProgramPeriods);
    periods.should.have.length(1);
    done();
  });

  it('should only return 1 available half-day ProgramPeriods when given the partial Unit Schedule and limitedAvailabilityFullDayProgramPeriods', function(done) {
    var periods = getProgramPeriodsThatFitUnitSchedule(mockData.partialUnitSchedule, mockData.limitedAvailabilityFullDayProgramPeriods);
    done();
  });

});
