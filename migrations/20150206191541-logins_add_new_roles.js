"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.changeColumn('Logins', 'role', DataTypes.ENUM('unit leader', 'pal', 'hq staff', 'admin', 'management team', 'registrar')).done(done);
    done();
  },

  down: function(migration, DataTypes, done) {
    migration.changeColumn('Logins', 'role', DataTypes.ENUM('unit leader', 'pal', 'hq staff', 'admin')).done(done);
    done();
  }
};
