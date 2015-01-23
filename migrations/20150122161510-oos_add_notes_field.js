"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('OOS', 'notes', DataTypes.TEXT).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('OOS', 'notes').done(done);
  }
};
