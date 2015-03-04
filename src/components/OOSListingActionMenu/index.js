var $ = require('jquery');

$(".dropdown-button").click(function(ev) {
  var $this = $(this);
  var clearing_current = $this.next().hasClass('show-menu') ? true : false;

  if (clearing_current) {
    $this.next().toggleClass('show-menu');
  } else {
    $(".dropdown-menu").removeClass("show-menu");
    $this.next().toggleClass('show-menu');
  }
  $(".dropdown-menu > li").click(function(){
    $(".dropdown-menu").removeClass("show-menu");
  });
});

$('.send_welcome_email').click(function(ev) {
  ev.preventDefault();
  var href = this.href;
  var $this = $(this);
  var oosId = $this.data('id');
  var $status_icon = $('i[data-id="' + oosId + '"]');
  $.ajax({
    url: href,
    type: 'get',
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

