'use strict';
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var unitHasPremiumActivity = require('../../lib/scheduleHelpers/unitHasPremiumActivity');
var unit = require('./mockScheduleData').partialUnitSchedule;

describe('Unit Has Premium Activity', function() {
  it ('should return true when the unit has a premium activity in their schedule', function(done) {
    unitHasPremiumActivity(unit.ProgramPeriods).should.be.true;
    done();
  });
});