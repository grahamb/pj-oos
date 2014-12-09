"use strict";

module.exports = function(sequelize, DataTypes) {
  var Program = sequelize.define("Program", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Program.hasMany(models.Staff, { as: 'Staff' });
      }
    }
  });

  return Program;
};
