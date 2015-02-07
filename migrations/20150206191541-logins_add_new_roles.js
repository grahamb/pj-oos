"use strict";
var db = require('../models').Login;

module.exports = {
  up: function(migration, DataTypes, done) {
    db.sequelize.query('ALTER TYPE "enum_Logins_role" ADD VALUE \'management team\' AFTER \'admin\'').done(done).catch(console.error);
  },

  down: function(migration, DataTypes, done) {
  }
};
