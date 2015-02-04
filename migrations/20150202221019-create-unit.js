"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Units", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      unit_number: {
        type: DataTypes.STRING
      },
      unit_name: {
        type: DataTypes.STRING
      },
      contact_name: {
        type: DataTypes.STRING
      },
      contact_email: {
        type: DataTypes.STRING
      },
      number_of_youth: {
        type: DataTypes.INTEGER
      },
      number_of_leaders: {
        type: DataTypes.INTEGER
      },
      final_payment_date: {
        type: DataTypes.DATEONLY
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Units").done(done);
  }
};