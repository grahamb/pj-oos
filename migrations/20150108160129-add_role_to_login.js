"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('Logins', 'role', DataTypes.ENUM('unit leader', 'pal', 'hq staff', 'admin')).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('Logins', 'role').done(done);
  }
};
