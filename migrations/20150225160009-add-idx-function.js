"use strict";
var sequelize = require('../models').sequelize;

module.exports = {
  up: function(migration, DataTypes, done) {
    sequelize.query("CREATE OR REPLACE FUNCTION idx(anyarray, anyelement) RETURNS int AS $$ SELECT i FROM (SELECT generate_series(array_lower($1,1),array_upper($1,1))) g(i) WHERE $1[i] = $2 LIMIT 1; $$ LANGUAGE sql IMMUTABLE;").done(done).catch(console.error);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
