import React from 'react';
import UnitField from './UnitField';
import $ from 'jquery';

const { PropTypes } = React;

const UnitTableRow = React.createClass({

  propTypes: {
    unit_id: PropTypes.number.isRequired,
    unit_number: PropTypes.string.isRequired,
    unit_name: PropTypes.string.isRequired,
    contact_first_name: PropTypes.string.isRequired,
    contact_last_name: PropTypes.string.isRequired,
    contact_email: PropTypes.string.isRequired,
    number_of_youth: PropTypes.number.isRequired,
    number_of_leaders: PropTypes.number.isRequired
  },

  getInitialState() {
    return {
      dirty: false,
      unit_number: this.props.unit_number,
      unit_name: this.props.unit_name,
      contact_first_name: this.props.contact_first_name,
      contact_last_name: this.props.contact_last_name,
      contact_email: this.props.contact_email,
      number_of_youth: this.props.number_of_youth,
      number_of_leaders: this.props.number_of_leaders
    };
  },

  selectionStatus(selection) {
    var className;
    var icon;
    const icons = {
      locked: { icon: 'lock', title: 'Locked' },
      unlocked: { icon: 'unlock-alt', title: 'Not Locked'},
      not_started: { icon: 'minus', title: 'Not Started' }
    };
    if (!selection.program_selection.length) {
      icon = icons.not_started
    } else if (selection.locked) {
      icon = icons.locked;
    } else {
      icon = icons.unlocked
    }
    className = `fa fa-${icon.icon}`
    return <i className={className} title={`${icon.title}`}></i>
  },

  handleChange(unit_id, event) {
    var payload = {dirty: true};
    const fieldName = event.target.name;
    const value = event.target.value;
    payload[fieldName] = value;
    this.setState(payload);

  },

  handleBlur(unit_id, event) {
    if (!this.state.dirty) { return; }
    const postUrl = `/units/${unit_id}`;
    const fieldName = event.target.name;
    const value = event.target.value;
    var payload = {};
    payload[fieldName] = value;
    $.post(postUrl, payload, (data) => { console.log(data); });
  },

  unitFields() {
    var fields = ['unit_number', 'number_of_youth', 'number_of_leaders', 'unit_name', 'contact_first_name', 'contact_last_name', 'contact_email'];
    return fields.map((f, i) => {
      return (
        <td key={i}>
          <UnitField
            blurHandler={this.handleBlur.bind(this, this.props.unit_id)}
            changeHandler={this.handleChange.bind(this, this.props.unit_id)}
            fieldValue={this.state[f]}
            fieldName={f}
          />
        </td>
      );
    })
  },

  render() {
    return (
      <tr key={this.props.unit_id}>
        {this.unitFields()}
        <td>{this.selectionStatus(this.props.program_selection)}</td>
        <td><button onClick={this.props.deleteHandler} style={{fontSize: '0.75em'}} className="button red">Delete</button></td>
      </tr>
    );
  }

});

export default UnitTableRow;
