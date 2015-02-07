"use strict";
var roles = require('../lib/roles');
var rolenames = Object.keys(roles);

module.exports = function(sequelize, DataTypes) {
  var Login = sequelize.define("Login", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    source_type: DataTypes.STRING,
    source_id: DataTypes.INTEGER,
    role: DataTypes.ENUM('unit leader', 'pal', 'hq staff', 'management team', 'registrar', 'admin')
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {}
    }
  });
  return Login;
};