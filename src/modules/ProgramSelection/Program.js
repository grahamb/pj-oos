'use strict';

var React = require('react/addons');
var ItemTypes = require('./ItemTypes');
var { PropTypes } = React;
var { DragDropMixin, DropEffects } = require('react-dnd');

var Program = React.createClass({
  mixins: [DragDropMixin],

  propTypes: {
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    moveProgram: PropTypes.func.isRequired,
    onMoveEnd: PropTypes.func.isRequired
  },

  statics: {
    configureDragDrop(register) {
      register(ItemTypes.PROGRAM, {
        dragSource: {

          beginDrag(component) {
            return {
              item: {
                id: component.props.id,
                rank: component.props.rank,
                text: component.props.text
              }
            };
          },

          endDrag(component) {
            component.props.onMoveEnd();
          }
        },

        dropTarget: {
          over(component, item) {
            component.props.moveProgram(item.id, component.props.id);
          },
        }
      });
    }
  },

  render() {
    var { isDragging } = this.getDragState(ItemTypes.PROGRAM);
    var premium = this.props.premium ? <i style={{color: 'gold'}} className='fa fa-star'></i> : null;
    var text = `Rank: ${this.props.rank} - ${this.props.text}`;
    var id = this.props.production ? '' : `(ID: ${this.props.id})`;
        return (
          <div {...this.dragSourceFor(ItemTypes.PROGRAM)}
               {...this.dropTargetFor(ItemTypes.PROGRAM)}
               style={{
                 border: '1px solid #D8D8D8',
                 borderRadius: '3px',
                 backgroundColor: 'white',
                 padding: '0.5rem',
                 margin: '0.5rem',
                 marginLeft: 0,
                 opacity: isDragging ? 0 : 1
               }}>
             {text} {premium} {id}
          </div>
        );
  }

});

module.exports = Program;