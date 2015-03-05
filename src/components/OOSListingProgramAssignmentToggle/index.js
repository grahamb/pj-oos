var $ = require('jquery');

$('.program_id').on('change', function(el) {
  var $this = $(this);
  var oosId = $this.data('id');
  var $status_icon = $('i[data-id="' + oosId + '"]');
  $.ajax({
    url: '/oos/' + oosId,
    type: 'post',
    data: {program_id: $this.val()},
    success: function(data, status, xhr) {
      $status_icon.addClass('fa-check-circle');
      window.setTimeout(function() {
        $status_icon.removeClass('fa-check-circle');
      }, 5000);
    },
    error: function(xhr, status, error) {
      $status_icon.addClass('fa-times-circle-o');
    }
  });
});