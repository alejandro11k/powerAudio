class PortProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            {name: 'periodicity', defaultValue: 1, minValue: 0.2, maxValue: 2}
        ];
      }

    constructor() {
        super();
        this._lastUpdate = currentTime;
        this.port.onmessage = this.handleMessage.bind(this);
    }
  
    handleMessage(event) {
      console.log('[Processor:Received] "' + event.data.message +
                  '" (' + event.data.timeStamp + ')');
    }

    process(inputs, outputs, parameters){
        // Post a message to the node for every 1 second.
        let periodicity = parameters.periodicity[0];
        if (currentTime - this._lastUpdate > periodicity) {
            this.port.postMessage({
            message: 'Process is called.',
            timeStamp: currentTime,
            });
            this._lastUpdate = currentTime;
        }

        /* process audio */
        let input = inputs[0];
        let output = outputs[0];
        let amplitude = parameters.amplitude;
        
        for (let channel = 0; channel < input.length; ++channel){
            output[channel].set(input[channel]);
        }
        
        return true;
    }
}

registerProcessor('processor', PortProcessor);