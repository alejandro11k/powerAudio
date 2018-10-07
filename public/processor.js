class PortProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            {name: 'bpm', defaultValue: 60, minValue: 40, maxValue: 300}
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
        let second = (60 / parameters.bpm[0]);
        if (currentTime - this._lastUpdate > second) {
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