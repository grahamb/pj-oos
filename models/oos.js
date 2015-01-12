"use strict";

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
    pre_recruited: DataTypes.BOOLEAN,
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
    dob: DataTypes.DATE,
  }, {
    underscored: true,
    tableName: 'OOS',
    freezeTableName: true,
    setterMethods: {
      dob: castEmptyStringToNull
    },
    getterMethods: {
      certifications_na: return_na,
      previous_experience_na: return_na,
      recruited_by_na: return_na
    },
    classMethods: {
      associate: function(models) {
        OOS.hasMany(models.Program, { through: 'program_oos_assignments' });
      }
    }
  });

  return OOS;
};

function return_na(field) {
  field = field.split('_na')[0];
  var val = this.getDataValue(field);
  return val ? val : 'N/A';
}

function castEmptyStringToNull(value, field) {
  value = value === '' ? null : value;
  this.setDataValue(field, value);
}
