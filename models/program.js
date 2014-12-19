"use strict";

module.exports = function(sequelize, DataTypes) {
  var Program = sequelize.define("Program", {
    name: DataTypes.STRING,
    shortName: DataTypes.STRING,
    description: DataTypes.STRING,
    shortDescription: DataTypes.STRING,
    fitnessLevel: {
      type: DataTypes.ENUM('average', 'good', 'high'),
      defaultValue: 'average'
    },
    prerequisites: DataTypes.ARRAY(DataTypes.STRING),
    knowledgeSkillsEquipment: DataTypes.ARRAY(DataTypes.STRING),
    premiumActivity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    location: DataTypes.ENUM('onsite', 'offsite'),
    programPeriodsAvailable: DataTypes.INTEGER,
    maxParticipantsPerPeriod: DataTypes.INTEGER,
    programPeriodsRequired: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1, max: 3 }
    },
    fee: {
      type: DataTypes.FLOAT,
      defaultValue: 0.00
    },
    hidden: DataTypes.BOOLEAN,
    oosRequired: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function(models) {
        Program.hasMany(models.Staff, { as: 'Staff' });
      }
    }
  });

  return Program;
};
