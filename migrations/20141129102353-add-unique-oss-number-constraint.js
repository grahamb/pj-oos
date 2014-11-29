"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.changeColumn('Staff', 'oos_number', { unique: true });
    done();
  },

  down: function(migration, DataTypes, done) {
    migration.changeColumn('Staff', 'oos_number', { unique: false });
    done();
  }
};
