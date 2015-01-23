"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('OOS', 'import_id', DataTypes.INTEGER).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('OOS', 'import_id').done(done);
  }
};
