"use strict";
var db = require('../models').ProgramSelection;

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    db.sequelize.query('ALTER TABLE "public"."ProgramSelections" ADD CONSTRAINT "ProgramSelections_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."Units" ("id") ON DELETE CASCADE;').done(done).catch(console.error);done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
