import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ItemTypes from './ItemTypes';
import Box from './Box';
import Connector from './Connector';
import Menu from './Menu';
import PlayButton from './controls/PlayButton';
import { makeNode } from './NodeFactory';

import { Play } from './jsonTWA/Audio';

const styles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  background: '#61666d',
};
/*,
paddingLeft: '150px'*/

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);

    component.moveBox(item.id, left, top);
  },
};

@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.BOX, boxTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
export default class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forbidDrag: false,
      boxes: {},
    };

    this.makeConnection = this.makeConnection.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.addNode = this.addNode.bind(this);
    this.playButtonClick = this.playButtonClick.bind(this);
  }

  moveBox(id, left, top) {
    this.setState(
      update(this.state, {
        boxes: {
          [id]: {
            $merge: { left, top },
          },
        },
      }),
    );
  }

  makeConnection(eventDetails) {
    var mouseIsDown = eventDetails.mouse === 'down';
    var mouseIsUp = eventDetails.mouse === 'up';

    var forbidDrag = mouseIsDown
      ? true
      : eventDetails.mouse === 'up'
        ? false
        : 'error';

    var newState = JSON.parse(JSON.stringify(this.state));
    newState.forbidDrag = forbidDrag;

    if (mouseIsDown) {
      newState.downConnector = {};
      newState.downConnector.nodeId = eventDetails.nodeId;
      newState.downConnector.connectorType = eventDetails.connectorType;
      newState.mouseIsDown = mouseIsDown;
    } else {
      console.log(
        '!!!!! make a connection between - ' +
          this.state.downConnector +
          ' and ' +
          eventDetails.nodeId,
      );
      newState = this.updateNodeState(this.state, newState, eventDetails);
      newState.downConnector = null;
      newState.mouseIsDown = !mouseIsDown;
    }

    this.setState(newState);

    console.log(newState);
    //console.log(coOrds.x, coOrds.y, coOrds.mouse);
  }

  /**
   * This checks if it's ok to make a connection and if so, does so
   */
  updateNodeState(state, newState, eventDetails) {
    //this.state.boxes.a.node.connections

    if (state.downConnector !== null && eventDetails.mouse === 'up') {
      if (state.downConnector.connectorType !== eventDetails.connectorType) {
        newState.boxes[eventDetails.nodeId].node.connections[
          eventDetails.connectorType
        ].push(
          state.boxes[eventDetails.nodeId].node.connections[
            eventDetails.connectorType
          ].concat(state.downConnector.nodeId),
        );

        var justConnectedWith = null;

        if (eventDetails.connectorType === 'output') {
          //input to output
          justConnectedWith = 'input';

          newState.connections = newState.connections
            ? newState.connections
            : [];
          newState.connections.push({
            output: eventDetails.nodeId,
            input: state.downConnector.nodeId,
          });
        } else if (eventDetails.connectorType === 'input') {
          //output to input
          justConnectedWith = 'output';

          newState.connections = newState.connections
            ? newState.connections
            : [];
          newState.connections.push({
            input: eventDetails.nodeId,
            output: state.downConnector.nodeId,
          });
        } else alert('Holy fuckshit batman!');

        newState.boxes[state.downConnector.nodeId].node.connections[
          justConnectedWith
        ].push(
          state.boxes[state.downConnector.nodeId].node.connections[
            justConnectedWith
          ].concat(eventDetails.nodeId),
        );

        console.log('newState', newState);
      }
    }

    return newState;
  }

  /*handleToggleForbidDrag() {

        this.setState({
            forbidDrag: !this.state.forbidDrag,
        });
    }*/
  mouseUp(event) {
    this.setState({
      forbidDrag: false,
    });
  }

  renderConnections(connections) {
    if (connections) {
      return (
        <svg style={{ width: '100%', height: '100%', position: 'absolute' }}>
          {connections.map((value, key) => {
            // const { left, top, title } = connections[key];

            //console.log("output x - "+this.state.boxes[value.output].connectors.output.top+ " Y - " + this.state.boxes[value.output].connectors.output.left);
            return (
              <line
                x1={
                  this.state.boxes[value.output].left +
                  this.state.boxes[value.output].connectors.outputOffset.left
                }
                y1={
                  this.state.boxes[value.output].top +
                  this.state.boxes[value.output].connectors.outputOffset.top
                }
                x2={
                  this.state.boxes[value.input].left +
                  this.state.boxes[value.input].connectors.inputOffset.left
                }
                y2={
                  this.state.boxes[value.input].top +
                  this.state.boxes[value.input].connectors.inputOffset.top
                }
                stroke-width="2"
                stroke="black"
              />
            );
          })}
        </svg>
      );
    }
  }

  addNode(type) {
    var config = {
      itemType: ItemTypes.NODE,
      type: type,
    };
    //var newNode = makeNode(config);

    var newState = JSON.parse(JSON.stringify(this.state));

    newState.boxes[type + (Object.keys(newState.boxes).length + 1)] = makeNode(
      config,
    );

    this.setState(newState);
  }

  playButtonClick() {
    var boxes = this.state.boxes;
    var nodes = [];

    for (var property in boxes) {
      if (boxes.hasOwnProperty(property)) {
        nodes.push(boxes[property].node);
      }
    }
    /*{boxes.map((value, key) => {

            nodes.push(value.node);

        })}*/
    /*debugger*/
    Play(nodes);
  }

  render() {
    const { hideSourceOnDrag, connectDropTarget } = this.props;
    const { boxes, connections } = this.state;

    return connectDropTarget(
      <div style={styles} onMouseUp={this.mouseUp}>
        <Menu addNode={this.addNode}>
          <PlayButton
            style={{ fontSize: '120px', border: 'none', background: 'none' }}
            playButtonClick={this.playButtonClick}
            class="mainPlay"
          />
        </Menu>

        {this.renderConnections(connections)}

        {Object.keys(boxes).map(key => {
          const { left, top, title } = boxes[key];
          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={hideSourceOnDrag}
              forbidDrag={this.state.forbidDrag}
            >
              <Connector
                type="input"
                makeConnection={this.makeConnection}
                nodeId={key}
              />
              {key}
              <Connector
                makeConnection={this.makeConnection}
                nodeId={key}
                type="output"
              />
            </Box>
          );
        })}
      </div>,
    );
  }
}
/*
onToggleForbidDrag={() => this.handleToggleForbidDrag()}*/
