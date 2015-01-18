"use strict";
module.exports = function(sequelize, DataTypes) {
  var Import = sequelize.define("Import", {
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    extension: DataTypes.STRING,
    status: DataTypes.STRING,
    import_type: DataTypes.STRING,
    size: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Import;
};