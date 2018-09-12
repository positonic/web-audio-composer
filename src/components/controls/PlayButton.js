import React from 'react';
const buttonStyle = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
};

class PlayButton extends React.Component {
  state = {
    isPlaying: this.props.isPlaying || false,
  };

  getButtonText() {
    return this.state.isPlaying ? (
      <i className="fa fa-stop-circle fa-6" aria-hidden="true" />
    ) : (
      <i className="fa fa-play-circle fa-6" aria-hidden="true" />
    );
  }

  play = () => {
    this.props.playButtonClick(!this.state.isPlaying);
    this.setState({ isPlaying: !this.state.isPlaying });
  };

  render() {
    return (
      <button
        style={buttonStyle}
        className={this.props.class}
        onClick={this.play}
      >
        {this.getButtonText()}
      </button>
    );
  }
}

export default PlayButton;
