/*

  fields:
    unit_number
    unit_name
    contact_first_name
    contact_last_name
    contact_email
    number_of_youth
    number_of_leaders
    final_payment_date
    notes

 */

var parse_csv_file = require('./lib/parse_csv_file');
var create_import_record = require('./lib/create_import_record');
var path = require('path');
var Promise = require('sequelize').Promise;
var models = require('../../models');
var Unit = models.Unit, ProgramSelection = models.ProgramSelection;

var g_import_id;

module.exports = function(file, status) {
  status = status || 'new';

  return create_import_record({
    import_type: 'unit',
    status: status,
    name: file.name,
    path: path.join(process.cwd(), file.path),
    mimetype: file.mimetype,
    extension: file.extension,
    size: file.size
  }).then(function(import_record) {
    g_import_id = import_record.id;
    return import_record;
  }).then(parse_csv_file).then(function(records_to_create) {
    return Promise.map(records_to_create, create_unit_record);
  }).catch(function(error) {
    throw new Error(error);
  });
};

var create_unit_record = function(record) {
  var g_record;
  record.import_id = g_import_id;
  return Unit.findOrCreate({
    where: { unit_number: record.unit_number },
    fields: Object.keys(record),
    defaults: record,
    include: [ProgramSelection]
  }).spread(function(record, created) {
    g_record = record;
    if (created) {
      return record.createProgramSelection().then(function(result) { console.log(result); return g_record; })
    } else {
      return record;
    }
  }).catch(function(error) {
    throw new Error(error);
  });
};