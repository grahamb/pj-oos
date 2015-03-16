"use strict";

var helpers = require('../lib/model_helpers');

module.exports = function(sequelize, DataTypes) {
  var Unit = sequelize.define("Unit", {
    unit_number: {
      type: DataTypes.STRING,
      unique: true
    },
    unit_name: DataTypes.STRING,
    contact_first_name: DataTypes.STRING,
    contact_last_name: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    number_of_youth: DataTypes.INTEGER,
    number_of_leaders: DataTypes.INTEGER,
    final_payment_date: DataTypes.DATEONLY,
    notes: DataTypes.TEXT,
    import_id: DataTypes.INTEGER,
    program_selection_invitation_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Unit.hasOne(models.ProgramSelection, {
          foreignKey: 'unit_id',
          onDelete: 'cascade',
        });
        Unit.hasOne(models.Login, {
          foreignKey: 'unit_id'
        });
      }
    },
    setterMethods: {
      final_payment_date: helpers.castEmptyStringToNull,
      number_of_youth: helpers.castEmptyStringToNull,
      number_of_leaders: helpers.castEmptyStringToNull
    },
    getterMethods: {
      contact_name: function() {
        return this.contact_first_name + ' ' + this.contact_last_name;
      }
    }
  });
  return Unit;
};