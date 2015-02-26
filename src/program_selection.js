'use strict';
var React = require('react/addons');
var ProgramSelection = require('./modules/ProgramSelection');

var target = document.getElementById('ProgramSelection');
if (target) {
  var production = $(target).data('production');
  React.render(<ProgramSelection production={production} />, target);
}
