var $ = require('jquery');

console.log('loaded oos');

function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
       var pair = vars[i].split("=");
       if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

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

$(document).ready(function(){
  $(".dropdown-button").click(function(ev) {
    $this = $(this);
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
    $this = $(this);
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

});
