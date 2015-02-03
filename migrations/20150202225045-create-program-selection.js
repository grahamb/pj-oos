"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("ProgramSelections", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      unit_number: {
        type: DataTypes.STRING
      },
      program_selection: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      locked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    migration.dropTable("ProgramSelections").done(done);
  }
};