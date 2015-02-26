'use strict';

var React = require('react/addons');
var update = require('react/lib/update');
var Program = require('./Program');

var SelectionContainer = React.createClass({

  getInitialState() {
    return {
      extra_free_period: this.props.selection.extra_free_period,
      programs: this.props.selection.programs.map((program) => {
        return {
          id: program.id,
          text: program.full_name_text,
          premium: program.premium_activity
        }
      })
    };
  },

  moveProgram(id, afterId) {
    var program = this.state.programs.filter(c => c.id === id)[0];
    var afterProgram = this.state.programs.filter(c => c.id === afterId)[0];
    var programIndex = this.state.programs.indexOf(program);
    var afterIndex = this.state.programs.indexOf(afterProgram);
    var stateUpdate = {
      programs: {
        $splice: [
          [programIndex, 1],
          [afterIndex, 0, program]
        ]
      }
    };
    this.setState(update(this.state, stateUpdate));
  },

  onMoveEnd() {
    console.log(this.state.programs.map( (c) => c.id ));
  },

  handleClick() {
    console.log(this.state.programs.map( (c) => c.id ));
  },

  render() {
    return (
      <div>
        {this.state.programs.map((program, index) => {
          return (
            <Program key={program.id}
                     id={program.id}
                     text={program.text}
                     rank={index+1}
                     premium={program.premium}
                     moveProgram={this.moveProgram}
                     onMoveEnd={this.onMoveEnd}
            />
          )
        })}
        <button onClick={this.handleClick}>Submit</button>
      </div>
    );
  }

});

module.exports = SelectionContainer;