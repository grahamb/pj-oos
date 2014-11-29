"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('Staff', 'oos_number', DataTypes.INTEGER);
    done();
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('Staff', 'oos_number');
    done();
  }
};
