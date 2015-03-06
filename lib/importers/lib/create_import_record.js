var models = require('../../../models');
var Import = models.Import;

/*
  options = {
    import_type,
    status,
    name,
    path,
    mimetype,
    extension,
    size
  }
*/
module.exports = function(options) {
  return Import.create(options).catch(function(error) { throw new Error(error); });
}