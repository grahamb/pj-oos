"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('Programs', 'auto_assign', {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        required: true
    }).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('Programs', 'auto_assign').done(done);
  }
};
