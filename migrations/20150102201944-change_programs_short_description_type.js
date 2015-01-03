"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.changeColumn('Programs', 'short_description', DataTypes.TEXT).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.changeColumn('Programs', 'short_description', DataTypes.STRING).done(done);
    done();
  }
};
