export function isOscillatorNode(node) {
  return node.type === 'oscillator';
}

export function isFilterNode(node) {
  return node.type === 'filter';
}

export function isGainNode(node) {
  return node.type === 'gain';
}

export function getTopPosition(type) {
  if (type === 'oscillator') {
    return 120;
  } else if (type === 'filter') {
    return 280;
  } /*else if (type === 'gain') {
		return 120;
	}*/

  return 140;
}
