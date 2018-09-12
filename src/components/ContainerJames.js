import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ItemTypes from './ItemTypes';
import Box from './BoxJames';
import Connector from './Connector';
import Menu from './Menu';
import PlayButton from './controls/PlayButton';
import { makeNode } from './NodeFactory';

import { Play } from './jsonTWA/Audio';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
import connect from 'react-redux/es/connect/connect';

const styles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  background: '#61666d',
};

const mapStateToProps = state => {
  return {
    boxes: state.boxes,
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
};

class Container extends Component {
  constructor(props) {
    super(props);

    this.makeConnection = this.makeConnection.bind(this);
    this.addNode = this.addNode.bind(this);
    this.playButtonClick = this.playButtonClick.bind(this);
  }

  componentDidMount() {}

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
    let newNode = makeNode({
      itemType: ItemTypes.NODE,
      type: type,
    });

    this.props.addBox(newNode);
  }

  playButtonClick() {
    var boxes = this.state.boxes;
    var nodes = [];

    for (var property in boxes) {
      if (boxes.hasOwnProperty(property)) {
        nodes.push(boxes[property].node);
      }
    }

    Play(nodes);
  }

  render() {
    const hideSourceOnDrag = true;
    const { boxes, connections } = this.props;
    const leftMargin = 180;

    return (
      <div style={styles} onMouseUp={this.mouseUp}>
        <Menu addNode={this.addNode}>
          <PlayButton
            style={{ fontSize: '120px', border: 'none', background: 'none' }}
            playButtonClick={this.playButtonClick}
            class="mainPlay"
          />
        </Menu>

        {this.renderConnections(connections)}

        {Object.keys(boxes).map((key, index) => {
          //const { left, top, title } = boxes[key];
          const { top, title } = boxes[key];
          const left = leftMargin + index * 180;

          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={hideSourceOnDrag}
              forbidDrag={this.props.forbidDrag}
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
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Container);

/*
onToggleForbidDrag={() => this.handleToggleForbidDrag()}*/
