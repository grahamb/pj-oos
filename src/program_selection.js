'use strict';
var React = require('react/addons');
var ProgramSelection = require('./modules/ProgramSelection');

var target = document.getElementById('ProgramSelection');
if (target) {
  React.render(<ProgramSelection />, target);
}
