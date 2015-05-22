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

const schedulingAlgorithim = 'mostParticipants';
const FREE_PERIOD = 25;
const TOWNSITE = 9;
const JDF = 3;

function findProgramPeriod(program, unit) {
  var how = ( program.id === FREE_PERIOD || program.id === JDF )? 'lastInTime' : schedulingAlgorithim;
  let periods = findProgramPeriodsWithSpaceForUnit(unit.total_participants, program.max_participants_per_period, program.ProgramPeriods);
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
    include: [ {model: models.ProgramPeriod, include: [{all:true}]}]
  });
}

function findFreePeriodAssigned(unit) {
  'use strict';
  let fp = null;
  unit.ProgramPeriods.forEach(function(period) {
    if (period.Program.id === FREE_PERIOD) {
      fp = period;
    }
  });
  return fp;
}

const createScheduleForUnit = Promise.coroutine(function* (unit) {
  console.log(`Assigning Programs for unit ${unit.id} - ${unit.unit_number} - ${unit.unit_name}`);
  let unit_id = unit.id;
  let programSelection = Array.from(unit.ProgramSelection.program_selection);
  programSelection.unshift(FREE_PERIOD, TOWNSITE);
  if (unit.ProgramSelection.extra_free_period) programSelection.unshift(FREE_PERIOD);

  while (programSelection.length > 0) {
    let unit = yield getUnit(unit_id);
    const targetProgram = programSelection.shift();
    let program = yield getProgram(targetProgram);

    // if program is premium and unit already has a premium program, skip
    const MAX_PREMIUM_ACTIVITY = 1;
    if (program.premium_activity && unitHasPremiumActivity(unit.ProgramPeriods) >= MAX_PREMIUM_ACTIVITY) {
      console.log('Unit already has a premium activity. Skipping %s.', program.name);
      continue;
    }

    console.log('Finding an available ProgramPeriod for %s', program.name);

    let period = findProgramPeriod(program, unit);
    if (period) {
      console.log(`  ${period.id}: ${period.start_at} - ${period.end_at}`);
      let result = yield unit.addProgramPeriod(period);

      // TODO: JDF
      if (period.Program.id === JDF) {

        console.log('  Starting JDF Munging...');
        const assignedFreePeriod = findFreePeriodAssigned(unit);
        if (assignedFreePeriod) {
          console.log(`   Found free period already assigned: ${assignedFreePeriod.id}, ${assignedFreePeriod.start_at}`);
          console.log('   Going to remove it...');
          yield unit.removeProgramPeriod(assignedFreePeriod);
          unit = yield getUnit(unit_id);
        }

        // calculate the start_at for the next period to find
        const start_at = moment(period.end_at).clone().hour(13).minute(30).toDate();
        console.log(`   Is there a program scheduled in the block after JDF? - ${start_at}`);
        const periodAfterJdf = unit.ProgramPeriods.find(function(period) {
          return period.start_at.getTime() === start_at.getTime();
        });
        if (periodAfterJdf) {
          console.log(`   Yes, there is: ${periodAfterJdf.id}: ${periodAfterJdf.Program.name} - ${periodAfterJdf.start_at}`);
          console.log(`   Old program selection: ${programSelection}`);
          programSelection.unshift(periodAfterJdf.Program.id);
          console.log(`   New program selection: ${programSelection}`);
          console.log('   Going to remove the period now.')
          yield unit.removeProgramPeriod(periodAfterJdf);
          unit = yield getUnit(unit_id);
        } else {
          console.log('   Nope, period is free.');
        }

        console.log(`   Now let's find a free period starting at ${start_at}`);
        const targetFreePeriod = yield models.ProgramPeriod.find({
          where: {
            program_id: FREE_PERIOD,
            start_at: start_at
          },
          order: 'start_at ASC'
        });
        console.log(`    ${targetFreePeriod.id} - ${targetFreePeriod.start_at}`);
        console.log('   Adding it');
        yield unit.addProgramPeriod(targetFreePeriod);
        ///
      }

    } else {
      console.log('  No available ProgramPeriod found for %s', program.name);
    }
  }

  let finalUnit = yield getUnit(unit_id);
  return finalUnit;
});

module.exports = createScheduleForUnit;

