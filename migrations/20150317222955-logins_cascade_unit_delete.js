"use strict";
var db = require('../models').Login;

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    db.sequelize.query('ALTER TABLE "public"."Logins" DROP CONSTRAINT "Logins_unit_id_fkey"; ALTER TABLE "public"."Logins" ADD CONSTRAINT "Logins_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."Units" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;').done(done).catch(console.error);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
