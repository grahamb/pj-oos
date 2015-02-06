"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('Programs', 'program_activity_leader_id', DataTypes.INTEGER).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('Programs', 'program_activity_leader_id').done(done);
  }
};
