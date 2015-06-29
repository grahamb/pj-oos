'use strict';
var db = require('../models').ProgramSelection;

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    db.sequelize.query('ALTER TABLE "public"."ProgramPeriods" ADD CONSTRAINT "ProgramPeriods_bus_departure_id_fkey" FOREIGN KEY ("bus_departure_id") REFERENCES "public"."BusDepartures" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;').done(done).catch(console.error);done();
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
