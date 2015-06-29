'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('BusDepartures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bus_number: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      departure_time: {
        type: Sequelize.TIME
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('BusDepartures');
  }
};