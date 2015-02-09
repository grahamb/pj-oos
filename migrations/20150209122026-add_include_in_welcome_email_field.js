"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('Programs', 'include_in_welcome_email', {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        required: true
    }).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('Programs', 'include_in_welcome_email').done(done);
  }
};
