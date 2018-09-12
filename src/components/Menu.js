import React, { Component } from 'react';
import MenuItem from './Menu/MenuItem';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(type) {
    this.props.addNode(type);
  }

  render() {
    return (
      <div
        style={{
          width: '150px',
          left: 0,
          top: 0,
          height: '100%',
          position: 'absolute',
          background: 'white',
          borderRadius: '5px',
          textAlign: 'center',
          paddingTop: '30px',
          zIndex: 1,
        }}
      >
        <MenuItem type="sine" handleClick={this.handleClick} />
        <MenuItem type="sawtooth" handleClick={this.handleClick} />
        <MenuItem type="square" handleClick={this.handleClick} />
        <MenuItem type="gain" handleClick={this.handleClick} />
        {/*<MenuItem type="lowPassFilter" handleClick={this.handleClick}/>*/}
        {/*<MenuItem type="filterControls" handleClick={this.handleClick}/>*/}
        {this.props.children}
      </div>
    );
  }
}
