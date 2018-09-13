import React, { Component } from 'react';
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  border: '1px dashed gray',
  backgroundColor: 'white',
  cursor: 'move',
  width: '150px',
  height: '130px',
  textAlign: 'center',
};

export default class Box extends Component {
  static propTypes = {
    id: PropTypes.any.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired,
    children: PropTypes.node,
  };

  render() {
    const { hideSourceOnDrag, left, top, isDragging, children } = this.props;
    if (isDragging && hideSourceOnDrag) {
      return null;
    }

    return <div style={{ ...style, left, top }}>{children}</div>;
  }
}
