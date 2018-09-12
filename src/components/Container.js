import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import Canvas from './Canvas';
import { ItemTypes } from './Constants';
import Menu from './Menu';
import HTML5Backend from 'react-dnd-html5-backend';

const nodes = [
  {
    type: ItemTypes.NODE,
    waveform: 'sine',
    pipeLength: 32,
    gain: 100,
    filter: 1000,
    tuning: 0,
    positionX: 300,
    positionY: 150,
    name: 'osc1',
  },
  {
    type: ItemTypes.NODE,
    waveform: 'saw',
    pipeLength: 32,
    gain: 100,
    filter: 1000,
    tuning: 0,
    positionX: 500,
    positionY: 150,
    name: 'osc2',
  },
];

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: nodes,
    };
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
          background: '#61666d',
        }}
      >
        <Menu />
        <Canvas key={0} nodes={this.state.nodes} />
      </div>
    );
  }
}

/*Board.propTypes = {
    knightPosition: PropTypes.arrayOf(
        PropTypes.number.isRequired
    ).isRequired
};*/

export default DragDropContext(HTML5Backend)(Container);
