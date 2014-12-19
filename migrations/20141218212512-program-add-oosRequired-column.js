"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn("Programs", "oosRequired", {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }).complete(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn("Programs", "oosRequired").complete(done);
  }
};
