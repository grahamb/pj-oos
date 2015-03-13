"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.addColumn('Logins', 'oos_id', {
      type: DataTypes.INTEGER,
      references: 'OOS',
      referencesKey: 'id'
    }).done(done);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
