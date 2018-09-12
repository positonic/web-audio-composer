import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ItemTypes } from './Constants';
import { DragSource } from 'react-dnd';

const knightSource = {
  beginDrag(props) {
    console.log('in begin Drag1');
    return {};
  },
  endDrag(props, monitor, component) {
    console.log('in end Drag');

    if (!monitor.didDrop()) {
      return;
    }
    // When dropped on a compatible target, do something
    /*const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
        CardActions.moveCardToList(item.id, dropResult.listId);*/
    console.log('in end Drag');
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

class Knight extends Component {
  render() {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div
        style={{
          opacity: isDragging ? 0.5 : 1,
          fontSize: 25,
          fontWeight: 'bold',
          cursor: 'move',
        }}
      >
        ♘
      </div>,
    );
  }
}

Knight.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default DragSource(ItemTypes.KNIGHT, knightSource, collect)(Knight);
