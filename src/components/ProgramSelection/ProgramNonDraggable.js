'use strict';

var React = require('react');
var ItemTypes = require('./ItemTypes');
var MoveButtons = require('./MoveButtons');
var { PropTypes } = React;

var Program = React.createClass({

  propTypes: {
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    buttonHandler: PropTypes.func.isRequired,
    programCount: PropTypes.number.isRequired
  },

  render() {
    var premium = this.props.premium ? <i style={{color: 'gold'}} className='fa fa-star'></i> : null;
    var text = `Rank: ${this.props.rank} - ${this.props.text}`;
    var id = this.props.production ? '' : `(ID: ${this.props.id})`;
        return (
          <div style={{
                 border: '1px solid #D8D8D8',
                 borderRadius: '3px',
                 backgroundColor: 'white',
                 padding: '0.5rem',
                 margin: '0.5rem',
                 marginLeft: 0,
                 opacity: 1
               }}
          >
             <MoveButtons {...this.props} maxbuttonHandler={this.props.buttonHandler} /> {text} {premium} {id}
          </div>
        );
  }

});

module.exports = Program;