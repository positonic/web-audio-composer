import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import { createStore } from 'redux';
import rootReducer from './reducers';

const defaultState = {
  boxes: {},
};

const store = createStore(rootReducer, defaultState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

/*** what??? boxes: {
		"Osc1":
			{
				top: 150, left: 300, title: 'Drag me around',
				connectors:
					{
						inputOffset: {
							top: 0,
							left: 0
						},
						outputOffset: {
							top: 100,
							left: 5
						}
					}
			}
	}*/
