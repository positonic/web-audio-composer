import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';
import Dustbin from './Dustbin';
import Box from './Box';
import Node from './Node';
import ItemTypes from './ItemTypes';

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

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dustbins: [{ accepts: [ItemTypes.NODE], lastDroppedItem: null }],
      boxes: nodes,
      droppedBoxNames: [],
    };
  }

  isDropped(boxName) {
    return this.state.droppedBoxNames.indexOf(boxName) > -1;
  }

  render() {
    const { boxes, dustbins } = this.state;

    return (
      <div style={{ height: '100%' }}>
        <div style={{ overflow: 'hidden', clear: 'both', height: '100%' }}>
          {dustbins.map(({ accepts, lastDroppedItem }, index) => (
            <Dustbin
              accepts={accepts}
              lastDroppedItem={lastDroppedItem}
              onDrop={item => this.handleDrop(index, item)}
              key={index}
              boxes={boxes}
            />
          ))}
        </div>
      </div>
    );
  }

  handleDrop(index, item) {
    const { name } = item;

    debugger;

    this.setState(
      update(this.state, {
        dustbins: {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        },
        droppedBoxNames: name
          ? {
              $push: [name],
            }
          : {},
      }),
    );
  }
}
