"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('ProgramSelections', 'extra_free_period', {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('ProgramSelections', 'extra_free_period').done(done);
  }
};
