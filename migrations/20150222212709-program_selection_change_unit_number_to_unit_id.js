"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.renameColumn('ProgramSelections', 'unit_number', 'unit_id').done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.renameColumn('ProgramSelections', 'unit_id', 'unit_name').done(done);
  }
};
