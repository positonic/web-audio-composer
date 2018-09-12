import React from 'react';
import James from './James';
import Card from './Card';
//import Container from "./ContainerNaive";
import Container from './ContainerJames';
import { hot } from 'react-hot-loader';

const App = () => (
  <div>
    <James />
    <Card text="Write the docs" />
    <Container />
  </div>
);

export default hot(module)(App);
