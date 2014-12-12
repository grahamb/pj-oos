"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('Programs', 'premiumActivity', DataTypes.BOOLEAN).complete(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('Programs', 'premiumActivity').complete(done);
  }
};
