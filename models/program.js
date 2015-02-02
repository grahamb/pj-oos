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
      allowNull: false,
      get: function() {
        switch (this.getDataValue('location')) {
          case 'onsite':
            return 'On-Site';
            break;
          case 'offsite':
            return 'Off-Site';
            break;
        }
      }
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
        Program.hasMany(models.OOS, { as: 'OOS', through: 'program_oos_assignments' });
      }
    },
    getterMethods: {
      full_name_html: function() {
        return this.short_name ? this.name + ' <span class="program_short_name">(' + this.short_name + ')</span>' : this.name;
      },
      full_name_text: function() {
        return this.short_name ? this.name + ' (' + this.short_name + ')' : this.name;
      },
      duration: function() {
        switch (this.program_periods_required) {
          case 1:
            return "Half-Day";
            break;
          case 2:
            return "Full-Day";
            break;
          case 3:
            return "Overnight";
            break;
        }
      },
      additional_cost: function() {
        return this.fee > 0 ? '$' + this.fee : 'None';
      }
    },
    setterMethods: {
      program_periods_available: castEmptyStringToNull,
      max_participants_per_period: castEmptyStringToNull,
      program_periods_required: castEmptyStringToNull,
      fee: castEmptyStringToNull,
      oos_required: castEmptyStringToNull,
      premium_activity: castStringToBoolean,
      hidden: castStringToBoolean,
      knowledge_skills_equipment: castStringToArray,
      prerequisites: castStringToArray
    }
  });

  return Program;
};

function castStringToBoolean(value, field) {
  if (value === 'true') { value = true; }
  if (value === 'false') { value = false; }
  if (typeof value === 'string') { value = false; }
  this.setDataValue(field, value);
}

function castEmptyStringToNull(value, field) {
  value = value === '' ? null : value;
  this.setDataValue(field, value);
}

function castStringToArray(value, field) {
  if (typeof value === 'string') {
    this.setDataValue(field, [value]);
  } else {
    this.setDataValue(field, value);
  }
}