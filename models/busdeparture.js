'use strict';
module.exports = function(sequelize, DataTypes) {
  var BusDeparture = sequelize.define('BusDeparture', {
    bus_number: DataTypes.ARRAY(DataTypes.INTEGER),
    departure_time: DataTypes.TIME
  }, {
    underscored: true,
    timestamps: false,
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return BusDeparture;
};