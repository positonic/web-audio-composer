import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
import James from './James';
import Container from './ContainerNaive';
import { makeNode } from './NodeFactory';
import ItemTypes from './ItemTypes';

const mapStateToProps = state => {
  return {
    boxes: state.boxes,
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
};

class JamesPresentational extends React.Component {
  addNode(type) {
    let newNode = makeNode({
      itemType: ItemTypes.NODE,
      type: 'sine',
    });

    this.props.addBox(newNode);
  }

  render() {
    return [
      <div className="button-container">
        {this.props.boxes.jamesBox}
        <a onClick={this.addNode.bind(this)}>click</a>
      </div>,
    ];
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JamesPresentational);
