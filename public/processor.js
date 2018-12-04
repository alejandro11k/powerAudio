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
        this.timeList = []
    }
  
    handleMessage(event) {
        /*
        console.log('[Processor:Received] "' + event.data.message +
                    '" (' + event.data.timeStamp + ')' + event.data.timeList);
        */
        if (event.data.message==='timeList') {
            let timeList = event.data.timeList
            timeList.reverse()
            this.timeList = timeList
        }
    }

    process(inputs, outputs, parameters){
        let bpmInSeconds = (60 / parameters.bpm[0]);

        let processCurrentTime = currentTime
        let isClickTime = processCurrentTime - this._lastUpdate > bpmInSeconds
        let isClockTime = processCurrentTime - this._lastUpdateClock > 1
        let length = this.timeList.length
        let isTimeListTime = false
        if (length!==0) {
            let lastElement = this.timeList[length-1]
            isTimeListTime = isTimeListTime = processCurrentTime >= lastElement
        }
        if (isClickTime || isClockTime || isTimeListTime) {
            this.port.postMessage({
            message: 'processorMsj',
            timeStamp: currentTime,
            isClick: isClickTime,
            isClock: isClockTime,
            isTimeListTime: isTimeListTime
            });
            if (isClickTime) {
                this._lastUpdate = currentTime;
            }
            if (isClockTime) {
                this._lastUpdateClock = currentTime;
            }
            if (isTimeListTime) {
                this.timeList.pop()
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