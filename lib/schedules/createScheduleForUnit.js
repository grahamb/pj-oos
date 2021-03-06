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

const SCHEDULING_ALTORITHIM = process.env['how'] || 'random';
const FREE_PERIOD = 25;
const TOWNSITE = 9;
const JDF = 3;
const MAX_PREMIUM_ACTIVITY = process.env['star'] || 1;
const SKIP = [ 2, 15 ];

function findProgramPeriod(program, unit, how) {
  var how = (program.id === FREE_PERIOD) ? 'random' : SCHEDULING_ALTORITHIM;
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
  if (u.periodsAssigned >= u.periodsToAssign) { console.log('unit schedule is full'); return u; }
  let unit = yield getUnit(u.unit_id);
  let unitScheduleIds = unit.ProgramPeriods.map(function(p) { return p.Program.id; });
  const current_program_id = u.program_selection[i];

  console.log(`Attempting to assign choice ${i} (${current_program_id}) for unit ${unit.id} - ${unit.unit_number} - ${unit.unit_name}`);


  if (process.env['skip'] && SKIP.indexOf(current_program_id) !== -1) {
    console.log(`Skipping program ${current_program_id}`);
    return u;
  }


  // skip if program already in schedule
  if (unitScheduleIds.indexOf(current_program_id) > -1) {
    console.log(`Unit already has program ${current_program_id} in their schedule; skipping.`);
    return u;
  }


  let program = yield getProgram(current_program_id);

  if (program.premium_activity && unitHasPremiumActivity(unit.ProgramPeriods) >= MAX_PREMIUM_ACTIVITY && !process.env.multistar) {
    console.log('Unit already has a premium activity. Skipping %s.', program.name);
    return u;
  }

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

