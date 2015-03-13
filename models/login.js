"use strict";

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
    unit_id: {
      type: DataTypes.INTEGER,
      references: 'Unit',
      referencesKey: 'id'
    },
    role: DataTypes.ENUM('unit leader', 'pal', 'hq staff', 'admin', 'management team', 'registrar')
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Login.belongsTo(models.Unit, {foreignKey: 'unit_id'});
        Login.belongsTo(models.OOS, {foreignKey: 'oos_id'});
      }
    }
  });
  return Login;
};