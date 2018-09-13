import React, { Component } from 'react';
import { getIcon } from '../modules/icons';
import ItemTypes from './ItemTypes';
import Box from './Box';
import Connector from './Connector';
import Menu from './Menu';
import PlayButton from './controls/PlayButton';
import { makeNode } from './NodeFactory';
import logo from '../../images/logo.png';

import { Play } from './jsonTWA/Audio';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
import connect from 'react-redux/es/connect/connect';
import MenuItem from './Menu/MenuItem';

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

    console.log(
      'makeConnection',
      mouseIsDown,
      eventDetails,
      newState.downConnector,
    );
    if (mouseIsDown) {
      newState.downConnector.nodeId = eventDetails.nodeId;
      newState.downConnector.connectorType = eventDetails.connectorType;
      newState.mouseIsDown = mouseIsDown;
    } else {
      console.log(
        '!!!!! make a connection between - ' +
          this.state.downConnector.nodeId +
          ' and ' +
          eventDetails.nodeId,
      );
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
                x1={
                  this.props.boxes[value.output].left +
                  this.props.boxes[value.output].connectors.outputOffset.left
                }
                y1={
                  this.props.boxes[value.output].top +
                  this.props.boxes[value.output].connectors.outputOffset.top
                }
                x2={
                  this.props.boxes[value.input].left +
                  this.props.boxes[value.input].connectors.inputOffset.left
                }
                y2={
                  this.props.boxes[value.input].top +
                  this.props.boxes[value.input].connectors.inputOffset.top
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

    const leftMargin = 180;
    let left = leftMargin + noBoxes * 180;
    console.log('left1a is ', left);

    let newNode = makeNode({
      itemType: ItemTypes.NODE,
      type: type,
      left: left,
    });

    console.log('left2 is ', newNode.left);

    this.props.addBox(newNode);
  }

  playButtonClick() {
    var boxes = this.props.boxes;
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
        <h3>Web audio composer</h3>
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

          const { title, type, waveform } = boxes[key].node;

          let top;
          if (type === 'oscillator') {
            top = 0;
          } else if (type === 'filter') {
            top = 120;
          } else {
            top = 240;
          }
          const left = leftMargin + index * 180;
          console.log('jd left manual', left);
          console.log('jd left box', key, boxes[key].left);
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
                src={getIcon(waveform)}
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
