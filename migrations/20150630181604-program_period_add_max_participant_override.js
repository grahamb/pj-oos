'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('ProgramPeriods', 'max_participants_override', Sequelize.INTEGER)
  },

  down: function (queryInterface, Sequelize) {
  }
};
