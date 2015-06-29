'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('ProgramPeriods', 'bus_departure_id', Sequelize.INTEGER);
  },

  down: function (queryInterface, Sequelize) {
  }
};
