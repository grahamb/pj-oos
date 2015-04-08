import React from 'react';

const UnitField = React.createClass({

  render() {
    return (
      <input
        type="text"
        value={this.props.fieldValue}
        name={this.props.fieldName}
        onChange={this.props.changeHandler}
        onBlur={this.props.blurHandler}
      />
    );
  }

});

export default UnitField;