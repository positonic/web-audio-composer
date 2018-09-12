import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ItemTypes } from './Constants';
import { DragSource } from 'react-dnd';

const nodeSource = {
  beginDrag(props) {
    console.log('in node Drag1!');
    return {};
  },

  endDrag(props, monitor, component) {
    /*if (!monitor.didDrop()) {
            return;
        }*/
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      debugger;
      window.alert(
        // eslint-disable-line no-alert
        `You dropped ${item.name} into ${dropResult.name}!`,
      );
    }
  } /*,
    endDrag(props, monitor, component) {
        console.log('in end node Drag');

        if (!monitor.didDrop()) {
            return;
        }
        // When dropped on a compatible target, do something
        /!*const item = monitor.getItem();
         const dropResult = monitor.getDropResult();
         CardActions.moveCardToList(item.id, dropResult.listId);*!/

debugger
        console.log('in end Drag');
    }*/,
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    dropOffset: monitor.getClientOffset(),

    /* connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
*/
  };
}
const style = {
  width: '150px',
  position: 'absolute',
  background: '#86a5d6',
  border: '1px solid #7589a8',
  borderRadius: '5px',
  cursor: 'pointer',
};
class Node extends Component {
  /*static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        //accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
        lastDroppedItem: PropTypes.object,
        onDrop: PropTypes.func.isRequired,
    };
*/
  render() {
    const { connectDragSource } = this.props;
    //const isActive = isOver && canDrop;

    //opacity: isDragging ? 0.5 : 1,
    return connectDragSource(
      <div
        style={{
          ...style,
          left: this.props.positionX,
          top: this.props.positionY,
        }}
      >
        <div
          style={{
            padding: '10px',
            background: 'white',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
          }}
        >
          {this.props.node.type}
        </div>
        <div style={{ padding: '10px' }}>
          {this.props.node.waveform}
          {this.props.children}
        </div>
      </div>,
    );
  }
}
/*Node.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
};*/

export default DragSource(ItemTypes.NODE, nodeSource, collect)(Node);
