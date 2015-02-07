"use strict";
module.exports = function(sequelize, DataTypes) {
  var ProgramSelection = sequelize.define("ProgramSelection", {
    unit_number: DataTypes.STRING,
    program_selection: DataTypes.ARRAY(DataTypes.STRING),
    extra_free_period: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ProgramSelection;
};