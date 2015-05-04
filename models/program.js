"use strict";

var helpers = require('../lib/model_helpers');

module.exports = function(sequelize, DataTypes) {
  var Program = sequelize.define("Program", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    short_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    short_description: DataTypes.TEXT,
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
    },
    auto_assign: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        required: true
    },
    include_in_welcome_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      required: true
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Program.hasMany(models.OOS, { as: 'OOS', through: 'program_oos_assignments' });
        Program.belongsTo(models.OOS, { as: 'ProgramActivityLeader', constraints: false });
        Program.hasMany(models.ProgramPeriod);
      }
    },
    getterMethods: {
      full_name_html: function() {
        return this.short_name ? this.name + ' <span class="program_short_name">(' + this.short_name + ')</span>' : this.name;
      },
      full_name_text: function() {
        return this.short_name ? this.name + ' (' + this.short_name + ')' : this.name;
      },
      short_or_long_name: function() {
        return this.short_name ? this.short_name : this.name;
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
      program_periods_available: helpers.castEmptyStringToNull,
      max_participants_per_period: helpers.castEmptyStringToNull,
      program_periods_required: helpers.castEmptyStringToNull,
      fee: helpers.castEmptyStringToNull,
      oos_required: helpers.castEmptyStringToNull,
      premium_activity: helpers.castStringToBoolean,
      hidden: helpers.castStringToBoolean,
      knowledge_skills_equipment: helpers.castStringToArray,
      prerequisites: helpers.castStringToArray,
      auto_assign: helpers.castStringToBoolean,
      program_activity_leader_id: helpers.castEmptyStringToNull,
      include_in_welcome_email: helpers.castStringToBoolean
    }
  });

  return Program;
};