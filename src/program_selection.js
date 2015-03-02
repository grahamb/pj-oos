'use strict';
var React = require('react/addons');
var ProgramSelection = require('ProgramSelection');
var $ = require('jquery');

var target = document.getElementById('ProgramSelection');
if (target) {
  var production = $(target).data('production');
  React.render(<ProgramSelection production={production} />, target);
}
