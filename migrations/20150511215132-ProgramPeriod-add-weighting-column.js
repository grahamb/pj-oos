'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('ProgramPeriods', 'spans_periods', { type: Sequelize.INTEGER });
  },

  down: function (queryInterface, Sequelize) {
  }
};
