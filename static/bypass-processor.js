class BypassProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._lastUpdate = currentTime;
        this.port.onmessage = this.handleMessage.bind(this);
    }

    handleMessage(event) {
        console.log('[Processor:Received] "' + event.data.message +
            '" (' + event.data.timeStamp + ')');
    }

    process(inputs, outputs) {
        // Post a message to the node for every 1 second.
        if (currentTime - this._lastUpdate > 1.0) {
            this.port.postMessage({
                message: 'Process is called.',
                timeStamp: currentTime,
            });
            this._lastUpdate = currentTime;
            console.log(this)
        }

        /* process audio */
        let input = inputs[0];
        let output = outputs[0];
        for (let channel = 0; channel < output.length; ++channel) {
            output[channel].set(input[channel]);
        }

        return true;
    }
}

registerProcessor('bypass-processor', BypassProcessor);