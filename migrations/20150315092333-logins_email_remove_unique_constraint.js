"use strict";
var db = require('../models').Login;

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    db.sequelize.query('ALTER TABLE "public"."Logins" DROP CONSTRAINT "Logins_email_key";').done(done).catch(console.error);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
