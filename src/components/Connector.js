import React, { Component } from 'react';

export default class Connector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseIsDown: false,
    };
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
  }

  getColour() {
    return this.props.type == 'input' ? 'yellow' : 'blue';
  }

  getText() {
    return this.props.type == 'input' ? 'I' : 'O';
  }

  getMarginTop() {
    return this.props.type == 'input' ? '0' : '20px';
  }

  getMarginBottom() {
    return this.props.type == 'input' ? '20px' : '0';
  }

  mouseDown(event) {
    this.setState({ mouseIsDown: true });

    this.props.makeConnection({
      x: event.clientX,
      y: event.clientY,
      mouse: 'down',
      nodeId: this.props.nodeId,
      connectorType: this.props.type,
    });
  }

  mouseUp(event) {
    if (this.state.mouseIsDown === true) {
      this.setState({ mouseIsDown: false });
    } else {
      this.props.makeConnection({
        x: event.clientX,
        y: event.clientY,
        mouse: 'up',
        nodeId: this.props.nodeId,
        connectorType: this.props.type,
      });
    }
  }

  render() {
    return (
      <div
        onMouseDown={this.mouseDown}
        onMouseUp={this.mouseUp}
        style={{
          marginBottom: this.getMarginBottom(),
          marginTop: this.getMarginTop(),
          height: '20px',
          width: '20px',
          background: this.getColour(),
        }}
      >
        {this.getText()}
      </div>
    );
  }
}
