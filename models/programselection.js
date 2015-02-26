"use strict";
module.exports = function(sequelize, DataTypes) {
  var ProgramSelection = sequelize.define("ProgramSelection", {
    unit_id: DataTypes.INTEGER,
    program_selection: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    extra_free_period: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    classMethods: {
      associate: function(models) {
        ProgramSelection.belongsTo(models.Unit, {foreignKey: 'unit_id'});
      }
    }
  });
  return ProgramSelection;
};