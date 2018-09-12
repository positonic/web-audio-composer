import React, { Component } from 'react';

export default class BoxInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseIsDown: false,
    };
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
  }

  mouseDown(event) {
    this.setState({ mouseIsDown: true });

    alert('x-' + event.clientX + ' / y-' + event.clientY);
  }

  mouseUp(event) {
    if (this.state.mouseIsDown === true) {
      this.setState({ mouseIsDown: false });
    }
  }

  render() {
    return (
      <div
        onMouseDown={this.mouseDown}
        onMouseUp={this.mouseUp}
        style={{
          marginBottom: '20px',
          height: '20px',
          width: '20px',
          background: 'yellow',
        }}
      >
        I
      </div>
    );
  }
}
