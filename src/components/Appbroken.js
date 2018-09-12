import React from 'react';
import { hot } from 'react-hot-loader';
import James from './James';
import Container from './ContainerNaive';
import * as actionCreators from '../actions/actionCreators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    boxes: state.boxes,
    soxes: state.soxes,
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
};

class Appbroken extends React.Component {
  render() {
    return [
      <div className="button-container">
        <James />
        <Container />
      </div>,
    ];
  }
}
const MaApped = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Appbroken);

export default hot(module)(MaApped);
