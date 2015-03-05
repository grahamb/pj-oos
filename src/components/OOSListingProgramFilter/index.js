var $ = require('jquery');
var getQueryVariable = require('GetQueryVariable');

var filter = getQueryVariable('program');
if (filter) {
  $('.assignmentFilter [value="' + filter + '"]').attr('selected', true);
  $('a.csv_export').attr('href', '/oos/csv?program=' + filter);
}

$('.assignmentFilter').on('change', function(el) {
  var val = $(this).val();
  var location = '/oos';
  window.location = val.toLowerCase() === 'all' ? location : location + '?program=' + val;
});

