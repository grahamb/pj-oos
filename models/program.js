"use strict";

module.exports = function(sequelize, DataTypes) {
  var Program = sequelize.define("Program", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    short_name: DataTypes.STRING,
    description: DataTypes.STRING,
    short_description: DataTypes.STRING,
    fitness_level: {
      type: DataTypes.ENUM('average', 'good', 'high'),
      defaultValue: 'average'
    },
    prerequisites: DataTypes.ARRAY(DataTypes.STRING),
    knowledge_skills_equipment: DataTypes.ARRAY(DataTypes.STRING),
    premium_activity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    location: {
      type: DataTypes.ENUM('onsite', 'offsite'),
      defaultValue: 'onsite',
      allowNull: false
    },
    program_periods_available: DataTypes.INTEGER,
    max_participants_per_period: DataTypes.INTEGER,
    program_periods_required: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1, max: 3 },
      allowNull: false
    },
    fee: {
      type: DataTypes.FLOAT,
      defaultValue: 0.00
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    oos_required: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Program.hasMany(models.OOS, { as: 'OOS', through: 'program_oos_assignments' })
      }
    },
    setterMethods: {
      program_periods_available: castEmptyStringToNull,
      max_participants_per_period: castEmptyStringToNull,
      program_periods_required: castEmptyStringToNull,
      fee: castEmptyStringToNull,
      oos_required: castEmptyStringToNull,
      hidden: castStringToBoolean
    }
  });

  return Program;
};

function castStringToBoolean(value, field) {
  switch (value) {
    case 'true':
      value = true;
      break;
    case 'false':
    deafult:
      value = false;
      break;
  }
  this.setDataValue(field, value);
}

function castEmptyStringToNull(value, field) {
  value = value === '' ? null : value;
  this.setDataValue(field, value);
}