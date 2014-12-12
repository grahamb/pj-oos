"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('Programs', 'hidden', DataTypes.BOOLEAN).complete(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('Programs', 'hidden').complete(done);
  }
};
