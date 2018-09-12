import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import Box from './Box';

const style = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  background: '#61666d',
  border: '5px solid red',
};

const dustbinTarget = {
  drop(props, monitor) {
    props.onDrop({
      item: monitor.getItem(),
      dropResult: monitor.getDropResult(),
    });
  },
};

@DropTarget(props => props.accepts, dustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class Dustbin extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastDroppedItem: PropTypes.object,
    onDrop: PropTypes.func.isRequired,
  };

  isDropped(boxName) {
    //return this.state.droppedBoxNames.indexOf(boxName) > -1;
    return false;
  }

  render() {
    const {
      boxes,
      accepts,
      isOver,
      canDrop,
      connectDropTarget,
      lastDroppedItem,
    } = this.props;
    const isActive = isOver && canDrop;

    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    return connectDropTarget(
      <div style={{ ...style, backgroundColor }}>
        {isActive
          ? 'Release to drop'
          : `This dustbin accepts: ${accepts.join(', ')}`}

        {lastDroppedItem && (
          <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p>
        )}

        <div style={{ overflow: 'hidden', clear: 'both' }}>
          {boxes.map(({ name, type }, index) => (
            <Box
              name={name}
              type={type}
              isDropped={this.isDropped(name)}
              key={index}
            />
          ))}
        </div>
      </div>,
    );
  }
}
