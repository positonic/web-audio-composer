import React, { Component } from 'react';
import { getIcon } from '../modules/icons';
import { getTopPosition } from '../components/NodeUtil';
import ItemTypes from './ItemTypes';
import Box from './Box';
import Connector from './Connector';
import Menu from './Menu';
import PlayButton from './controls/PlayButton';
import { makeNode } from './NodeFactory';

import { Play } from './jsonTWA/Audio';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
import connect from 'react-redux/es/connect/connect';

const leftMargin = 180;

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

    this.state = {
      mouseIsDown: false,
      downConnector: {},
    };

    this.makeConnection = this.makeConnection.bind(this);
    this.addNode = this.addNode.bind(this);
    this.playButtonClick = this.playButtonClick.bind(this);
  }

  componentDidMount() {}

  makeConnection(eventDetails) {
    let mouseIsDown = eventDetails.mouse === 'down';
    let mouseIsUp = eventDetails.mouse === 'up';

    let newState = this.state;

    if (mouseIsDown) {
      console.log('eventDetails', eventDetails);
      newState.downConnector.nodeId = eventDetails.nodeId;
      newState.downConnector.connectorType = eventDetails.connectorType;
      newState.mouseIsDown = mouseIsDown;
    } else {
      newState = this.updateNodeState(this.state, newState, eventDetails);
      newState.downConnector = {};
      newState.mouseIsDown = !mouseIsDown;
    }

    this.setState(newState);
  }

  /**
   * This checks if it's ok to make a connection and if so, does so
   */
  updateNodeState(state, newState, eventDetails) {
    if (state.downConnector !== null && eventDetails.mouse === 'up') {
      if (state.downConnector.connectorType !== eventDetails.connectorType) {
        this.props.addConnector({
          nodeId: eventDetails.nodeId,
          connectorType: eventDetails.connectorType,
          connectFromNodeId: state.downConnector.nodeId,
        });

        var justConnectedWith = null;

        if (eventDetails.connectorType === 'output') {
          //input to output
          justConnectedWith = 'input';
        } else if (eventDetails.connectorType === 'input') {
          //output to input
          justConnectedWith = 'output';
        } else alert('Glitch in the Matrix!!!');

        this.props.addConnector({
          nodeId: state.downConnector.nodeId,
          connectorType: justConnectedWith,
          connectFromNodeId: eventDetails.nodeId,
        });
      }
    }

    return newState;
  }

  renderConnections() {
    let connections = [];
    for (let box in this.props.boxes) {
      /* Always only do it from one side (above) */
      this.props.boxes[box].node.connections.output.forEach(inputFrom => {
        if (inputFrom !== box) {
          connections.push({
            output: box,
            input: inputFrom,
          });
        }
      });
    }

    if (connections) {
      return (
        <svg style={{ width: '100%', height: '100%', position: 'absolute' }}>
          {connections.map((value, key) => {
            return (
              <line
                key={key}
                x1={
                  this.props.boxes[value.output].left +
                  this.props.boxes[value.output].connectors.outputOffset.left
                }
                y1={
                  this.props.boxes[value.output].top +
                  this.props.boxes[value.output].connectors.outputOffset.top +
                  140
                }
                x2={
                  this.props.boxes[value.input].left +
                  this.props.boxes[value.input].connectors.inputOffset.left
                }
                y2={
                  this.props.boxes[value.input].top +
                  this.props.boxes[value.input].connectors.inputOffset.top +
                  140
                }
                strokeWidth="2"
                stroke="#FC9C43"
              />
            );
          })}
        </svg>
      );
    }
  }

  addNode(type) {
    let noBoxes = Object.keys(this.props.boxes).length;

    let left = leftMargin + noBoxes * 180;

    let newNode = makeNode({
      itemType: ItemTypes.NODE,
      type: type,
    });
    newNode.top = getTopPosition(type);
    newNode.left = left;

    console.log('newNode', newNode);
    this.props.addBox(newNode);
  }

  playButtonClick(makePlay) {
    let boxes = this.props.boxes;
    let nodes = [];

    for (let property in boxes) {
      if (boxes.hasOwnProperty(property)) {
        let node = boxes[property].node;
        node.id = property;
        nodes.push(node);
      }
    }

    Play(nodes, makePlay);
  }

  render() {
    const hideSourceOnDrag = true;
    const { boxes, connections } = this.props;

    return (
      <div style={styles} onMouseUp={this.mouseUp}>
        <h3>Web audio composer</h3>
        <PlayButton
          style={{ fontSize: '120px', border: 'none', background: 'none' }}
          playButtonClick={this.playButtonClick}
          class="mainPlay"
        />
        <Menu addNode={this.addNode} />

        {this.renderConnections(connections)}

        {Object.keys(boxes).map((key, index) => {
          //const { left, top, title } = boxes[key];

          const { type, waveform } = boxes[key].node;
          const { top } = boxes[key];

          //let top = getTopPosition(type);
          const icon = type === 'oscillator' ? waveform : type;

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
              <img
                style={{ width: '40%', marginTop: '25px' }}
                src={getIcon(icon)}
              />
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
