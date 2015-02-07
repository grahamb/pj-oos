"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.changeColumn('Logins', 'role', DataTypes.ENUM('unit leader', 'pal', 'hq staff', 'management team', 'registrar', 'admin')).done(done);
    done();
  },

  down: function(migration, DataTypes, done) {
    migration.changeColumn('Logins', 'role', DataTypes.ENUM('unit leader', 'pal', 'hq staff', 'admin')).done(done);
    done();
  }
};
