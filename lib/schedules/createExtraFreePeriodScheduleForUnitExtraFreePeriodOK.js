'use strict';

const models = require('../../models');
const moment = require('moment');
const Promise = models.sequelize.Promise;
require('es6-shim');

const chooseProgramPeriod = require('../scheduleHelpers/chooseProgramPeriod');
const findProgramPeriodsWithSpaceForUnit = require('../scheduleHelpers/findProgramPeriodsWithSpaceForUnit');
const getNumberOfParticipantsForProgramPeriod = require('../scheduleHelpers/getNumberOfParticipantsForProgramPeriod');
const getProgramPeriodsThatFitUnitSchedule = require('../scheduleHelpers/getProgramPeriodsThatFitUnitSchedule');
const unitHasProgramInSchedule = require('../scheduleHelpers/unitHasProgramInSchedule');
const unitHasPremiumActivity = require('../scheduleHelpers/unitHasPremiumActivity');

const schedulingAlgorithim = 'random';
const FREE_PERIOD = 25;
const MAX_PREMIUM_ACTIVITY = process.env['star'] || 1;

function findProgramPeriod(program, unit) {
  var how = schedulingAlgorithim;
  let periods = findProgramPeriodsWithSpaceForUnit(unit.total_participants, program.ProgramPeriods);
  periods = getProgramPeriodsThatFitUnitSchedule(unit, periods);
  if (!periods.length) {
    return null;
  }
  return chooseProgramPeriod(periods, how);
}

function getUnit(id) {
  return models.Unit.find({
    where: {id: id},
    include: [
      models.ProgramSelection,
      {
        model: models.ProgramPeriod,
        include: [{all:true}]
      }
    ]
  });
}

function getProgram(id) {
  return models.Program.find({
    where: { id: id },
    include: [ {model: models.ProgramPeriod, include: [{all:true}]}],
    order: [[ { model: models.ProgramPeriod }, 'start_at' ]]

  });
}

const createScheduleForUnit = Promise.coroutine(function* (u, i) {
  if (u.periodsAssigned === u.periodsToAssign) { console.log('unit schedule is full'); return u; }
  let unit = yield getUnit(u.unit_id);
  let unitScheduleIds = unit.ProgramPeriods.map(function(p) { return p.Program.id; });

  console.log(`Attempting to assign choice ${i} (${u.program_selection[i]}) for unit ${unit.id} - ${unit.unit_number} - ${unit.unit_name}`);

  let program = yield getProgram(u.program_selection[i]);

  console.log('Finding an available ProgramPeriod for %s', program.name);

  let period = findProgramPeriod(program, unit);

  if (period) {
    console.log(`  ${period.id}: ${period.start_at} - ${period.end_at}`);
    let result = yield unit.addProgramPeriod(period);
    u.periodsAssigned += period.spans_periods;
  } else {
    console.log('  No available ProgramPeriod found for %s', program.name);
  }
  return u
});

module.exports = createScheduleForUnit;

