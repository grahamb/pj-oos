"use strict";
var db = require('../models').Login;

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
   db.sequelize.query('UPDATE "Logins" SET oos_id = source_id WHERE source_type = \'OOS\' AND source_id IS NOT NULL;').done(done).catch(console.error);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
