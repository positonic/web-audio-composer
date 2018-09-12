var baseNode = {
  top: 150,
  left: 700,
  title: 'Drag me around',
  connectors: {
    inputOffset: {
      top: 0,
      left: 0,
    },
    outputOffset: {
      top: 100,
      left: 5,
    },
  },
  node: {},
};

function isSine(type) {
  if (type === 'sine') {
    return true;
  }
  return false;
}
function isSawtooth(type) {
  if (type === 'sawtooth') {
    return true;
  }
  return false;
}

function isSquare(type) {
  if (type === 'square') {
    return true;
  }
  return false;
}

function isLowpassFilter(type) {
  if (type === 'lowPassFilter') {
    return true;
  }
  return false;
}

function isOscillator(type) {
  if (isSine(type) || isSawtooth(type) || isSquare(type)) {
    return true;
  }
  return false;
}

function isFilter(type) {
  if (isLowpassFilter(type)) {
    return true;
  }
  return false;
}

function isGain(type) {
  if (type === 'gain') {
    return true;
  }
  return false;
}

function makeOscillator(config) {
  var node = {
    type: 'oscillator',
    waveform: config.type,
    pipeLength: 32,
    gain: 100,
    filter: 1000,
    tuning: 0,
    name: 'type',
    connections: {
      output: [],
      input: [],
    },
  };

  baseNode.node = node;

  return baseNode;
}

function makeFilter(config) {
  var filter = {
    type: 'filter',
    tunaType: 'Chorus',
    props: {
      rate: 1.5,
      feedback: 0.2,
      delay: 0.0045,
      bypass: 0,
    },
  };

  baseNode.node = filter;

  return baseNode;
}

function makeGain(config) {
  var gainNode = {
    type: 'gain',
    gain: {
      value: 1,
    },
    connections: {
      output: [],
      input: [],
    },
  };

  baseNode.node = gainNode;

  return baseNode;
}

export function makeNode(config) {
  if (isOscillator(config.type)) {
    return makeOscillator(config);
  }

  if (isFilter(config.type)) {
    return makeFilter(config);
  }

  if (isGain(config.type)) {
    return makeGain(config);
  }

  return newNode;
}
