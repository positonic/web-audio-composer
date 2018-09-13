import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import rootReducer from './reducers';
import { Provider } from 'react-redux';
import App from './components/App';

const defaultState = {
  boxes: {},
};

const store = createStore(rootReducer, defaultState);

store.subscribe(() => console.log('subscribe', store.getState()));
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
