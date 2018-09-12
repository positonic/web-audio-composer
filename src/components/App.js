import React from 'react';
import { hot } from 'react-hot-loader';
import Container from './ContainerNaive';

class App extends React.Component {
  render() {
    return [
      <div className="button-container">
        <Container />
      </div>,
    ];
  }
}

export default hot(module)(App);
