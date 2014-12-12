"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('Programs', 'shortName', DataTypes.STRING);
    migration.addColumn('Programs', 'description', DataTypes.STRING);
    migration.addColumn('Programs', 'shortDescription', DataTypes.STRING);
    migration.addColumn('Programs', 'fitnessLevel', DataTypes.STRING);
    migration.addColumn('Programs', 'prerequisites', DataTypes.ARRAY(DataTypes.STRING));
    migration.addColumn('Programs', 'knowledgeSkillsEquipment', DataTypes.ARRAY(DataTypes.STRING));
    migration.addColumn('Programs', 'location', DataTypes.STRING);
    migration.addColumn('Programs', 'programPeriodsAvailable', DataTypes.INTEGER);
    migration.addColumn('Programs', 'maxParticipantsPerPeriod', DataTypes.INTEGER);
    migration.addColumn('Programs', 'programPeriodsRequired', DataTypes.INTEGER);
    migration.addColumn('Programs', 'fee', DataTypes.INTEGER);
    done();
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('Programs', 'shortName');
    migration.removeColumn('Programs', 'description');
    migration.removeColumn('Programs', 'shortDescription');
    migration.removeColumn('Programs', 'fitnessLevel');
    migration.removeColumn('Programs', 'prerequisites');
    migration.removeColumn('Programs', 'knowledgeSkillsEquipment');
    migration.removeColumn('Programs', 'location');
    migration.removeColumn('Programs', 'programPeriodsAvailable');
    migration.removeColumn('Programs', 'maxParticipantsPerPeriod');
    migration.removeColumn('Programs', 'programPeriodsRequired');
    migration.removeColumn('Programs', 'fee');
    done();
  }
};
