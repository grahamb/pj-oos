var $ = require('jquery');

$(document).ready(function() {
  console.log('loaded navbar');
  $('#js-navigation-menu').removeClass("show");
  $('#js-mobile-menu').on('click', function(e) {
    e.preventDefault();
    $('#js-navigation-menu').slideToggle(function(){
      if($('#js-navigation-menu').is(':hidden')) {
        $('#js-navigation-menu').removeAttr('style');
      }
    });
  });
});
