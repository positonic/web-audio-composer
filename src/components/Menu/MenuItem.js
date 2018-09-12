import React, { Component } from 'react';
import oscIcon from '../../../images/osc-symbol.gif';
import velocityIcon from '../../../images/velocity.png';
import sineIcon from '../../../images/oscillator_sine.png';
import sawIcon from '../../../images/oscillator_saw.png';
import squareIcon from '../../../images/oscillator_square.png';
import lowPassFilterIcon from '../../../images/filter_lowpass.png';
/*import filterControlsIcon from '../../../images/filter_controls.png';*/

/*import gainIcon from '../../../images/gain.png';*/

export default class OscMenuItem extends Component {
  constructor(props) {
    super(props);

    this.addNode = this.addNode.bind(this);
  }

  /*left: this.props.node.positionX,
     top: this.props.node.positionY,
     position: 'absolute',
     background: '#86a5d6',
     border: '1px solid #7589a8',
     borderRadius: '5px'*/
  addNode(event) {
    this.props.handleClick(this.props.type);
  }

  getIcon() {
    if (this.props.type === 'osc') {
      return oscIcon;
    } else if (this.props.type === 'sine') {
      return sineIcon;
    } else if (this.props.type === 'gain') {
      return velocityIcon;
    } else if (this.props.type === 'sawtooth') {
      return sawIcon;
    } else if (this.props.type === 'square') {
      return squareIcon;
    } else if (this.props.type === 'lowPassFilter') {
      return lowPassFilterIcon;
    } else if (this.props.type === 'filterControls') {
      return filterControlsIcon;
    }
  }

  render() {
    return (
      <div
        style={{
          width: '80px',
          margin: '0 auto',
          cursor: 'pointer',
        }}
        onClick={this.addNode}
      >
        <img style={{ width: '100%' }} src={this.getIcon()} />
      </div>
    );
  }
}
/*

Node.propTypes = {
    black: PropTypes.bool
};*/
