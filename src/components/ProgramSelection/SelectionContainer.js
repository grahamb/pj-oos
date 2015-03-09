'use strict';

var React = require('react');
var update = require('react/lib/update');
var Program = require('./Program');
var ProgramNonDraggable = require('./ProgramNonDraggable');
var $ = require('jquery');

var SelectionContainer = React.createClass({
  lastSuccessfulState: {},

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

  componentWillMount() {
    this.lastSuccessfulState = this.state;
    if (window.IE_LTE_9) {
      document.getElementById('replace_text').textContent = 'using the up and down buttons';
    }
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
    this.postDataToServer();
  },

  handleSubmit() {
    this.postDataToServer(true);
  },

  toggleExtraFreePeriod() {
    this.setState({extra_free_period: !this.state.extra_free_period}, this.postDataToServer);
  },

  moveProgramManually(program_id, from_rank, to_rank) {
    var programs_array = this.state.programs.map(p => p);
    var from_index = from_rank-1;
    var to_index = to_rank-1;

    if (to_index < 0 || to_index >= this.state.programs.length) {
      return false;
    }

    var tmp = programs_array.splice(from_index, 1);
    programs_array.splice(to_index, 0, tmp[0]);
    this.setState({
      programs: programs_array
    }, function() {
      this.postDataToServer();
    });
  },

  postDataToServer(locked=false) {
    var sel = this.state.programs.map( (c) => c.id );
    var payload = {
      program_selection: sel,
      extra_free_period: this.state.extra_free_period,
      locked: locked,
      some_array: ['foo', 'bar']
    }
    $.ajax({
      url: `/program_selection/${this.props.selection.id}`,
      method: 'POST',
      dataType: 'json',
      data: JSON.stringify(payload),
      contentType: "application/json; charset=utf-8",
      success: (response) => {

        if (response.locked) {
          window.location = `/program_selection/${response.id}`;
        } else {
          this.setState({
              program_selection: response.program_selection,
              extra_free_period: response.extra_free_period
            })
        }
      },
      error: (jqxhr, textStatus, error) => {
        // TODO display some sort of warning to the user that the request failed
        this.setState(this.lastSuccessfulState);
      }.bind(this)
    });
  },

  renderNonDraggable() {
    return (
      this.state.programs.map((program,index) => {
        return (
          <ProgramNonDraggable key={program.id}
                               id={program.id}
                               text={program.text}
                               rank={index+1}
                               premium={program.premium}
                               buttonHandler={this.moveProgramManually}
                               programCount={this.state.programs.length}
                               production={this.props.production}
          />
        )
      })
    )

  },

  renderDraggable() {
    return (
      this.state.programs.map((program,index) => {
        return (
          <Program key={program.id}
                   id={program.id}
                   text={program.text}
                   rank={index+1}
                   premium={program.premium}
                   moveProgram={this.moveProgram}
                   onMoveEnd={this.onMoveEnd}
                   programCount={this.state.programs.length}
                   production={this.props.production}
          />
        )
      })
    )
  },

  render() {
    var renderProgams = window.IE_LTE_9 ? this.renderNonDraggable : this.renderDraggable;
    var checkboxStyle = {
      marginLeft: '10px'
    };
    var buttonStyle = {
      marginTop: '20px'
    };
    return (
      <div>

        {renderProgams()}

        <label htmlFor="extra_free_period">
          Extra Free Period
          <input onClick={this.toggleExtraFreePeriod} style={checkboxStyle} type="checkbox" name="extra_free_period" id="extra_free_period" defaultChecked={this.state.extra_free_period}></input>
        </label>

        <button style={buttonStyle} className="button green" onClick={this.handleSubmit}><i className="fa fa-save"></i>Submit Program Selection</button>
      </div>
    );
  }

});

module.exports = SelectionContainer;