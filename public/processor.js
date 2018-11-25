class PortProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            {name: 'bpm', defaultValue: 60, minValue: 40, maxValue: 300}
        ];
      }

    constructor() {
        super();
        this._lastUpdate = currentTime;
        this._lastUpdateClock = currentTime;
        this.port.onmessage = this.handleMessage.bind(this);
    }
  
    handleMessage(event) {
      console.log('[Processor:Received] "' + event.data.message +
                  '" (' + event.data.timeStamp + ')');
    }

    process(inputs, outputs, parameters){
        let bpmInSeconds = (60 / parameters.bpm[0]);

        let processCurrentTime = currentTime
        let isClickTime = processCurrentTime - this._lastUpdate > bpmInSeconds
        let isClockTime = processCurrentTime - this._lastUpdateClock > 1

        // console.log(isSecondTime, isBpmTime)

        if (isClickTime || isClockTime) {
            this.port.postMessage({
            message: 'processorMsj',
            timeStamp: currentTime,
            isClick: isClickTime,
            isClock: isClockTime
            });
            if (isClickTime) {
                this._lastUpdate = currentTime;
            }
            if (isClockTime) {
                this._lastUpdateClock = currentTime;
            }
        }

        /* process audio */
        let input = inputs[0];
        let output = outputs[0];
        
        for (let channel = 0; channel < input.length; ++channel){
            output[channel].set(input[channel]);
        }
        
        return true;
    }
}

registerProcessor('processor', PortProcessor);