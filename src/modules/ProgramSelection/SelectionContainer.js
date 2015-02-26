'use strict';

var React = require('react/addons');
var update = require('react/lib/update');
var Program = require('./Program');

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
    // TODO need to actually do something after this returns - take user to a confirmation page.
    //      Should maybe do a real browser submit instead of ajax for this one.
    this.postDataToServer(true);
  },

  toggleExtraFreePeriod() {
    this.setState({extra_free_period: !this.state.extra_free_period}, this.postDataToServer);
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
          window.location = '/program_selection';
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

  render() {
    var checkboxStyle = {
      marginLeft: '10px'
    };
    var buttonStyle = {
      marginTop: '20px'
    };
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
                     production={this.props.production}
            />
          )
        })}

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