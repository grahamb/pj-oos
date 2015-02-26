"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.changeColumn('ProgramSelections', 'program_selection', {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    }).done(done).catch(console.error);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
