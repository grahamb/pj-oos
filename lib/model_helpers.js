var helpers = {};

helpers.castStringToBoolean = function(value, field) {
  if (value === 'true') { value = true; }
  if (value === 'false') { value = false; }
  if (typeof value === 'string') { value = false; }
  this.setDataValue(field, value);
}

helpers.castEmptyStringToNull = function(value, field) {
  value = value === '' ? null : value;
  this.setDataValue(field, value);
}

helpers.castStringToArray = function(value, field) {
  if (typeof value === 'string') {
    this.setDataValue(field, [value]);
  } else {
    this.setDataValue(field, value);
  }
}

helpers.return_na = function(field) {
  field = field.split('_na')[0];
  var val = this.getDataValue(field);
  return val ? val : 'N/A';
}

helpers.castEmptyStringToNull = function(value, field) {
  value = value === '' ? null : value;
  this.setDataValue(field, value);
}


module.exports = helpers;
