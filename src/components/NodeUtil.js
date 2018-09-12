export function isOscillatorNode(node) {
  return node.type === 'oscillator';
}

export function isFilterNode(node) {
  return node.type === 'filter';
}

export function isGainNode(node) {
  return node.type === 'gain';
}
