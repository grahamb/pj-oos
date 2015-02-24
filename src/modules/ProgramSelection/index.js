'use strict';

var React = require('react/addons');
var SelectionContainer = require('./SelectionContainer');

var ProgramSelection = React.createClass({
  render() {
    return (
      <SelectionContainer
        style={{width: '50%'}}
        programs={JSON.parse(document.getElementById('programs_json').textContent)}
      />
    );
  }

});

module.exports = ProgramSelection;