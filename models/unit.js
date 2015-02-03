"use strict";
module.exports = function(sequelize, DataTypes) {
  var Unit = sequelize.define("Unit", {
    unit_number: DataTypes.STRING,
    unit_name: DataTypes.STRING,
    contact_name: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    number_of_youth: DataTypes.INTEGER,
    number_of_leaders: DataTypes.INTEGER,
    final_payment_date: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models) {
        Unit.hasOne(models.ProgramSelection);
      }
    }
  });
  return Unit;
};