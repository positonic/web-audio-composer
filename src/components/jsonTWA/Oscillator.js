export const Oscillator = (audioContext, voiceConfig) => {
  let oscillators = [];
  let delayedRoutingNodes = []; //This oscillators didn't yet exist when we tried to connect them so now we try again
  let masterVca = audioContext.createGain();

  masterVca.gain.value = voiceConfig.gain / 100;

  const me = {
    getOscillatorConfig(oscNumber) {
      return voiceConfig.oscillators[oscNumber];
    },

    createOscillatorById(oscNumber) {
      let oscConfig = me.getOscillatorConfig(oscNumber);

      me.createOscillator(oscConfig);
    },

    applyTuning(vco, tuning) {
      if (tuning !== 0) {
        vco.detune.value = tuning;
      }

      return vco;
    },

    setPipeLengthOnOscillator(vco, pipeLength) {
      if (pipeLength !== 0) {
        vco.pipeLength = pipeLength;
      }

      return vco;
    },

    createOscillator(oscConfig) {
      let vco = audioContext.createOscillator();
      vco.type = oscConfig.waveform;
      vco = me.applyTuning(vco, oscConfig.tuning);
      vco = me.setPipeLengthOnOscillator(vco, oscConfig.pipeLength);

      me.connectInputToVca(me.addOscillatorGain(vco, oscConfig.gain));

      return vco;
    },

    createOscillatorWithRouting(oscConfig) {
      let myOscillators = oscillators;
      let vco = audioContext.createOscillator();
      vco.type = oscConfig.waveform;
      vco = me.applyTuning(vco, oscConfig.tuning);
      vco = me.setPipeLengthOnOscillator(vco, oscConfig.pipeLength);

      if (oscConfig.connections.output.find(o => o.indexOf('gain') > -1)) {
        console.log('Connecting ', oscConfig.id, ' to gain node');
        me.connectInputToVca(me.addOscillatorGain(vco, oscConfig.gain));
      } else if (
        oscConfig.connections.output.find(o => o.indexOf('oscillator') > -1)
      ) {
        console.log('Connecting ', oscConfig.id, ' to another oscillator node');

        oscConfig.connections.output.forEach(destinationNodeId => {
          //Do we have the oscillatory already?

          let destinationNode = oscillators.find(
            o => o.id === destinationNodeId,
          );
          if (destinationNode) {
            //connect to it
            me.connect(destinationNode);
          } else {
            // add it to a list we parse later
            console.log('Cant find ', destinationNodeId, ' will try later');
            let toConnect = {};
            toConnect[destinationNodeId] = vco;
            delayedRoutingNodes.push(toConnect);
          }
        }, this);
      }

      vco.id = oscConfig.id;

      return vco;
    },

    connectInputToVca: node => {
      node.connect(masterVca);
    },

    connectVcaToOutput: node => {
      masterVca.connect(node);
    },

    addOscillatorGain(vco, vcoGain) {
      var vcoGainControl = audioContext.createGain();
      vcoGainControl.gain.value = vcoGain / 100;
      vco.connect(vcoGainControl);

      return vcoGainControl;
    },

    play: () => {
      oscillators.forEach(osc => {
        me.start(osc, 0, 3, 440);
      });
    },

    stopAll: () => {
      console.log('stopall', oscillators);
      oscillators.forEach(osc => {
        osc.stop();
        console.log('osc', osc);
      });
    },

    start: (vco, time, noteLength, frequency) => {
      vco.frequency.value = me.applyPipeLength(frequency, vco.pipeLength);

      vco.start(time);
      vco.stop(time + noteLength);
    },

    applyPipeLength: (frequency, pipeLength) => {
      return frequency / (parseInt(pipeLength, 10) / 8);
    },

    setupOscillators() {
      voiceConfig.oscillators.forEach(osc => {
        oscillators.push(me.createOscillator(osc));
      });

      //me.connectVcaToOutput(output);
      return masterVca;
    },

    setupRoutedOscillators() {
      voiceConfig.oscillators.forEach(osc => {
        oscillators.push(me.createOscillatorWithRouting(osc));
      });

      for (let destinationNodeId in delayedRoutingNodes) {
        let delayedSourceNode = delayedRoutingNodes[destinationNodeId];

        oscillators.forEach(oscillator => {
          if (delayedSourceNode.hasOwnProperty(oscillator.id)) {
            delayedSourceNode[oscillator.id].connect(oscillator);
            console.log(
              'Delay connected ',
              delayedSourceNode.id,
              destinationNodeId,
            );
          }
        });

        if (destinationNode) {
          delayedSourceNode.connect(destinationNode);
        } else {
          console.log(
            'This should never happen because we have delayed connection until all nodes are created',
          );
        }

        /*let destinationNode = oscillators.find(o => delayedSourceNode.hasOwnProperty(o.id));
				debugger
				if(destinationNode) {
					delayedSourceNode.connect(destinationNode)
					console.log('Delay connected ', delayedSourceNode.id, destinationNodeId);
        } else {
					console.log('This should never happen because we have delayed connection until all nodes are created');
        }*/
      }

      //me.connectVcaToOutput(output);
      return masterVca;
    },
  };
  return me;
};
