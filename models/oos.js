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
    getterMethods: {
      certifications_na: function() {
        return this.certifications ? this.certifications : 'N/A';
      },
      previous_experience_na: function() {
        return this.previous_experience ? this.previous_experience : 'N/A';
      }
    },
    classMethods: {
      associate: function(models) {
        OOS.hasMany(models.Program, { through: 'program_oos_assignments' });
      }
    }
  });

  return OOS;
};
