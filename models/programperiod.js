'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProgramPeriod = sequelize.define('ProgramPeriod', {
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
    spans_periods: DataTypes.INTEGER
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        ProgramPeriod.belongsToMany(models.Unit, { through: 'Schedule' });
        ProgramPeriod.belongsTo(models.Program);
      }
    }
  });
  return ProgramPeriod;
};