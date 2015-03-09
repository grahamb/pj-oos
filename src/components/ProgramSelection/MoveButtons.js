var React = require('react');

var MoveButtons = React.createClass({

  moveUp() {
    this.props.buttonHandler(this.props.id, this.props.rank, this.props.rank-1);
  },

  moveDown() {
    this.props.buttonHandler(this.props.id, this.props.rank, this.props.rank+1);
  },

  shouldRenderUpButton() {
    if (this.props.rank !== 1) {
      return <button onClick={this.moveUp}><i className="fa fa-angle-double-up"></i></button>
    }
  },

  shouldRenderDownButton() {
    if (this.props.rank !== this.props.programCount) {
      return <button onClick={this.moveDown}><i className="fa fa-angle-double-down"></i></button>
    }
  },

  render() {
    return (
      <div className="manualButtonContainer">
        {this.shouldRenderUpButton()} {this.shouldRenderDownButton()}
      </div>
    );
  }

});

module.exports = MoveButtons;