import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
import JamesPresentational from './JamesPresentational';

const James = () => {
  return (
    <div>
      <h1>James here</h1>
      <JamesPresentational />
    </div>
  );
};
export default connect()(James);
