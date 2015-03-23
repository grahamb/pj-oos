'use strict';
var React = require('react');
var ProgramSelectionStats = require('ProgramSelectionStats');

var data = JSON.parse(document.getElementById('rankings_json').textContent)
var target = document.getElementById('ProgramSelectionStats');

React.render(<ProgramSelectionStats data={data} />, target);
