"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Imports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      path: {
        type: DataTypes.STRING
      },
      mimetype: {
        type: DataTypes.STRING
      },
      extension: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING
      },
      import_type: {
        type: DataTypes.STRING
      },
      size: {
        type: DataTypes.INTEGER
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
    migration.dropTable("Imports").done(done);
  }
};