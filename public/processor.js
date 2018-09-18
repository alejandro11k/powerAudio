class PortProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            {name: 'amplitude', defaultValue: 0.25, minValue: 0, maxValue: 1},
            {name: 'periodicity', defaultValue: 1, minValue: 0.2, maxValue: 2},
            {name: 'amplitude', defaultValue: 0.25, minValue: 0, maxValue: 1}
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
        let periodicity = parameters.periodicity; // definitivamente esto no es para lo q va a ser usado
        if (currentTime - this._lastUpdate > periodicity[0]) {
            console.log(periodicity[0])
            this.port.postMessage({
            message: 'Process is called.',
            timeStamp: currentTime,
            });
            this._lastUpdate = currentTime;
            //console.log(this)
        }
        /* process audio */
        let input = inputs[0];
        let output = outputs[0];
        let amplitude = parameters.amplitude;
        
        for (let channel = 0; channel < input.length; ++channel){
            output[channel].set(input[channel]);
        }
        

        /*
        for (let channel = 0; channel < output.length; ++channel) {
            let outputChannel = output[channel];
            for (let i = 0; i < outputChannel.length; ++i) {
              // outputChannel[i] = 2 * (Math.random() - 0.5) * amplitude[i];
              outputChannel[i] = amplitude[i];
            }
        }
        */
        return true;
    }
}

registerProcessor('processor', PortProcessor);