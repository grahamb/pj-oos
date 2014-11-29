"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Staff", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.TEXT
      },
      city: {
        type: DataTypes.STRING
      },
      province: {
        type: DataTypes.STRING
      },
      country: {
        type: DataTypes.STRING
      },
      postal_code: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      cell_phone: {
        type: DataTypes.STRING
      },
      pre_recruited: {
        type: DataTypes.BOOLEAN
      },
      recruited_by: {
        type: DataTypes.STRING
      },
      assigned_program: {
        type: DataTypes.INTEGER
      },
      desired_department: {
        type: DataTypes.STRING
      },
      previous_experience: {
        type: DataTypes.TEXT
      },
      certifications: {
        type: DataTypes.TEXT
      },
      dob: {
        type: DataTypes.DATE
      },
      registration_date: {
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Staff").done(done);
  }
};