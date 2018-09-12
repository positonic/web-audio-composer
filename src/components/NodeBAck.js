import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ItemTypes } from './Constants';
import { DropTarget } from 'react-dnd';

const nodeTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  },
};

/*const nodeSource = {
    beginDrag(props) {
        console.log('in node Drag1!');
        return {};
    },
    endDrag(props, monitor, component) {
debugger
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
    }

};*/

function collect(connect, monitor) {
  return {
    /*connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        dropOffset: monitor.getClientOffset()*/

    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
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
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    //accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastDroppedItem: PropTypes.object,
    onDrop: PropTypes.func.isRequired,
  };

  render() {
    const { connectDropTarget, isOver, canDrop } = this.props;
    const isActive = isOver && canDrop;
    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }
    //opacity: isDragging ? 0.5 : 1,
    return connectDropTarget(
      <div
        style={{
          ...style,
          left: this.props.positionX,
          top: this.props.positionY,

          backgroundColor,
        }}
      >
        {/* {lastDroppedItem &&
                <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p>
                }*/}
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

export default DropTarget(ItemTypes.NODE, nodeTarget, collect)(Node);
