import oscIcon from '../../images/osc-symbol.gif';
import sineIcon from '../../images/oscillator_sine.png';
import velocityIcon from '../../images/velocity.png';
import sawIcon from '../../images/oscillator_saw.png';
import squareIcon from '../../images/oscillator_square.png';
import lowPassFilterIcon from '../../images/filter_lowpass.png';

export function getIcon(type) {
  if (type === 'osc') {
    return oscIcon;
  } else if (type === 'sine') {
    return sineIcon;
  } else if (type === 'gain') {
    return velocityIcon;
  } else if (type === 'sawtooth') {
    return sawIcon;
  } else if (type === 'square') {
    return squareIcon;
  } else if (type === 'lowPassFilter') {
    return lowPassFilterIcon;
  } else if (type === 'filterControls') {
    return lowPassFilterIcon;
  }
}
