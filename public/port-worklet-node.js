import { getCounter, stepCounter, getBeats, getTimeLimitEnable} from './audio-core.js'

export class PortWorkletNode extends AudioWorkletNode {
    constructor(context) {
        super(context, 'processor');
        // this.counter = 1;
        this.port.onmessage = this.handleMessage.bind(this);
        this.port.postMessage({
            message: 'Are you ready?',
            timeStamp: this.context.currentTime
        });
    }

    handleMessage(event) {
        // this.counter++;
        console.log('[Node:Received] "' + event.data.message + '" (' + event.data.timeStamp + ')');

        this.click.execute(this)
        // Notify the processor when the node gets 10 messages. Then reset the
        // counter.

        if (getTimeLimitEnable() && getCounter() >= getBeats()) {
            this.port.postMessage({
                message: 'insert coin!',
                timeStamp: this.context.currentTime
            });
            // this.counter = 1;
            this.context.suspend()
            // this.context.currentTime
        }

        stepCounter()
    }

    setSound(sound) {
        this.click = sound 
    }
    
}

export class ClockWorkletNode extends AudioWorkletNode {
    constructor(context) {
        super(context, 'processor');
        // this.counter = 1;
        this.port.onmessage = this.handleMessage.bind(this);
        this.port.postMessage({
            message: 'Are you ready?',
            timeStamp: this.context.currentTime
        });
    }

    handleMessage(event) {
        // console.log('[Node:Received] "' + event.data.message + '" (' + event.data.timeStamp + ')');
        this.clock.click()
    }

    setClock(clock) {
        this.clock = clock
    }

}


