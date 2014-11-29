"use strict";

module.exports = function(sequelize, DataTypes) {
  var Staff = sequelize.define("Staff", {
    oos_number: { type: DataTypes.INTEGER, unique: true },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    country: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    phone: DataTypes.STRING,
    cell_phone: DataTypes.STRING,
    pre_recruited: DataTypes.BOOLEAN,
    recruited_by: DataTypes.STRING,
    assigned_program: DataTypes.INTEGER,
    desired_department: DataTypes.STRING,
    previous_experience: DataTypes.TEXT,
    certifications: DataTypes.TEXT,
    dob: DataTypes.DATE,
    registration_date: DataTypes.DATE
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Staff.hasOne(models.Program);
      }
    }
  });

  return Staff;
};
