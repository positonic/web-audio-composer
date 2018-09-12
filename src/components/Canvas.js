import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './Constants';
import Node from './Node';
import Menu from './Menu';
import HTML5Backend from 'react-dnd-html5-backend';

/*props.onDrop(monitor.getItem());*/

const canvasTarget = {
  drop(props, monitor, component) {
    //debugging here fucvks things up
    console.log('monitor  ssss ' + monitor.getSourceClientOffset());

    return monitor.getItem();
  },
};
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}
class Canvas extends Component {
  /*constructor(props) {
        super(props);
         this.state = {
            nodes: this.props.nodes
         };
    }
*/
  updatePosition(x, y) {
    debugger;
  }

  handleDrop(index, item) {
    debugger;
    /* const { name } = item;

        this.setState(update(this.state, {
            dustbins: {
                [index]: {
                    lastDroppedItem: {
                        $set: item,
                    },
                },
            },
            droppedBoxNames: name ? {
                $push: [name],
            } : {},
        }));*/
  }
  //debugger
  /*const { name } = item;

        this.setState(update(this.state, {
            dustbins: {
                [index]: {
                    lastDroppedItem: {
                        $set: item,
                    },
                },
            },
            droppedBoxNames: name ? {
                $push: [name],
            } : {},
        }));*/

  renderNode(node, i) {
    const piece = 'XXX';
    console.log('i is ' + i);
    //updatePosition={this.updatePosition.bind(this)
    return (
      <Node
        key={i}
        node={node}
        positionX={node.positionX}
        positionY={node.positionY}
        onDrop={item => this.handleDrop(index, item)}
      >
        >
      </Node>
    );
  }

  render() {
    const { connectDropTarget } = this.props;

    const renderNodes = [];

    var that = this;

    this.props.nodes.forEach(function(node, key) {
      renderNodes.push(that.renderNode(node, key));
    });

    return connectDropTarget(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
          background: '#61666d',
          border: '5px solid red',
        }}
      >
        {renderNodes}
      </div>,
    );
  }
}

/*Board.propTypes = {
    knightPosition: PropTypes.arrayOf(
        PropTypes.number.isRequired
    ).isRequired
};*/
export default DropTarget(ItemTypes.NODE, canvasTarget, collect)(Canvas);
