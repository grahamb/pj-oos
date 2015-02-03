"use strict";
module.exports = function(sequelize, DataTypes) {
  var ProgramSelection = sequelize.define("ProgramSelection", {
    unit_number: DataTypes.STRING,
    program_selection: DataTypes.ARRAY,
    locked: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ProgramSelection;
};