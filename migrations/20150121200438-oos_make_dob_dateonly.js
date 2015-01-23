"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.changeColumn('OOS', 'dob', {
        type: DataTypes.DATEONLY
    }).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.changeColumn('OOS', 'dob', {
        type: DataTypes.DATE
    }).done(done);
  }
};
