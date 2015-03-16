"use strict";

var helpers = require('../lib/model_helpers');

module.exports = function(sequelize, DataTypes) {
  var OOS = sequelize.define("OOS", {
    oos_number: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    country: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    phone: DataTypes.STRING,
    cell_phone: DataTypes.STRING,
    pre_recruited: {
      type: DataTypes.BOOLEAN,
      default_value: false
    },
    recruited_by: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    previous_experience: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    certifications: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    dob: DataTypes.DATEONLY,
    notes: DataTypes.TEXT,
    import_id: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'OOS',
    freezeTableName: true,
    setterMethods: {
      dob: helpers.castEmptyStringToNull
    },
    getterMethods: {
      certifications_na: helpers.return_na,
      previous_experience_na: helpers.return_na,
      recruited_by_na: helpers.return_na,
      current_age: function() {
        var moment = require('moment');
        var now = moment(new Date());
        var dob = moment(new Date(this.dob));
        return Math.floor(moment.duration(now.diff(dob)).asYears());
      }
    },
    classMethods: {
      associate: function(models) {
        OOS.hasMany(models.Program, { through: 'program_oos_assignments' });
        OOS.hasOne(models.Login, { foreignKey: 'unit_id' });
      }
    }
  });

  return OOS;
};