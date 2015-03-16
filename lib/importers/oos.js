var parse_csv_file = require('./lib/parse_csv_file');
var create_import_record = require('./lib/create_import_record');
var path = require('path');
var models = require('../../models');
var OOS = models.OOS, Program = models.Program;
var Promise = require('sequelize').Promise;

var g_import_id;

function main(file, status) {
  status = status || 'new';
  return create_import_record({
    import_type: 'oos',
    status: status,
    name: file.name,
    path: path.join(process.cwd(), file.path),
    mimetype: file.mimetype,
    extension: file.extension,
    size: file.size
  }).then(function(import_record) {
    g_import_id = import_record.id;
    return import_record;
  }).then(parse_csv_file).then(modify_record_fields).then(function(records_to_create) {
    return Promise.map(records_to_create, create_oos_record);
  }).catch(function(error) {
    throw new Error(error);
  });
};

var modify_record_fields = function(csv_records) {
  return new Promise(function(resolve, reject) {
    // dump the contents of assigned_department and desired department into the notes field
    var import_records = csv_records.map(function(record) {
      record.notes = record.assigned_department + '\n' + record.desired_assignment;
      return record;
    });
    resolve(import_records);
  });
};

var create_oos_record = function(record) {
  // list of importable fields
  var fields = Object.keys(record);
  var g_record;
  // remove the assigned_department and desired_department fields from the list of importable fields
  ['assigned_department', 'desired_assignment'].forEach(function(field) {
    fields.splice(fields.indexOf(field), 1);
  });
  fields.push('import_id');
  record.notes = record.assigned_department + '\n' + record.desired_assignment;
  record.import_id = g_import_id;

  return OOS.findOrCreate({
    where: { oos_number: record.oos_number },
    fields: fields,
    defaults: record,
    include: [Program]
  }).spread(function(record, created) {
    g_record = record;
    if (created) {
      return record.setPrograms([0]).then(function(result) { return g_record; });
    } else {
      return null;
    }
  }).catch(function(error) {
    throw new Error(error);
  });

};

module.exports = main;