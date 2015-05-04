'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProgramPeriod = sequelize.define('ProgramPeriod', {
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ProgramPeriod;
};