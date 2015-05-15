'use strict';
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var mockData = require('./mockProgramPeriodsInsufficientSpaceData.js');
var findProgramPeriodsWithSpaceForUnit = require('../../lib/scheduleHelpers/findProgramPeriodsWithSpaceForUnit');

describe('Filter Periods With Insufficent Space', function() {

  it('should return 8 available ProgramPeriods that can fit the Unit of 8 participants', function(done) {
    var periods = findProgramPeriodsWithSpaceForUnit(mockData.total_participants, mockData.program_capacity, mockData.halfDayProgramPeriodsWithUnits);
    periods.should.have.length(8);
    done();
  });

  it('should return all 11 ProgramPeriods that can fit the Unit of 8 participants when none have units', function(done) {
    var periods = findProgramPeriodsWithSpaceForUnit(mockData.total_participants, mockData.program_capacity, mockData.halfDayProgramPeriodsWithoutUnits);
    periods.should.have.length(11);
    done();
  });

  it('should return 0 ProgramPeriods that can fit the Unit of 8 participants when all are full', function(done) {
    var periods = findProgramPeriodsWithSpaceForUnit(mockData.total_participants, mockData.program_capacity, mockData.halfDayProgramPeriodsAllFull);
    periods.should.have.length(0);
    done();
  });

});
