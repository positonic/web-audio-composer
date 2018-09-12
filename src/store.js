import rootReducer from './reducers/index';
import { createStore, compose, applyMiddleware } from 'redux';
var stateImmutable = {};

/*
const store = createStore(rootReducer, stateImmutable, applyMiddleware(remoteActionMiddleware));*/

const store = createStore(rootReducer, stateImmutable);

function setStore(state) {
  //var sequencer  = fromJS(state.sequencer);

  var instruments = fromJS(state.instruments);
  //var sequencer  = fromJS(state.sequencer);

  var stateImmutable = {};

  stateImmutable.instruments = instruments;
  //stateImmutable.sequencer = sequencer;

  const store = createStore(
    rootReducer,
    stateImmutable,
    applyMiddleware(remoteActionMiddleware),
  );

  return store;
}

export { setStore };
