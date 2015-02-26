'use strict';

var React = require('react/addons');
var SelectionContainer = require('./SelectionContainer');

var ProgramSelection = React.createClass({
  render() {
    return (
      <SelectionContainer
        style={{width: '50%'}}
        selection={JSON.parse(document.getElementById('selection_json').textContent)}
      />
    );
  }

});

module.exports = ProgramSelection;