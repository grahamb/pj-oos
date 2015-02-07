"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.changeColumn('ProgramSelections', 'locked', {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }).done(done);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
