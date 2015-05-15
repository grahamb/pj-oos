'use strict';
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var unitHasProgramInSchedule = require('../../lib/scheduleHelpers/unitHasProgramInSchedule');
var unitSchedule = require('./mockScheduleData').partialUnitSchedule;

describe('Check if Unit has Program in Schedule', function() {

  it('should return 1 ProgramPeriod when searching for Program.id 9', function(done) {
    var periods = unitHasProgramInSchedule(unitSchedule, 9)
    periods.should.have.length(1);
    done();
  });

  it('should return false when searching for Program.id 1', function(done) {
    var periods = unitHasProgramInSchedule(unitSchedule, 1)
    periods.should.be.false;
    done();
  });

});