import { getCounter, stepCounter, getTimeLimitEnable, getTimeLimit} from './audio-core.js'

export class PortWorkletNode extends AudioWorkletNode {
    constructor(context) {
        super(context, 'processor');
        this.counter = 1;
        this.port.onmessage = this.handleMessage.bind(this);
        this.port.postMessage({
            message: 'Are you ready?',
            timeStamp: this.context.currentTime
        });
    }

    handleMessage(event) {
        // this.counter++;
        // console.log('[Node:Received] "' + event.data.message + '" (' + event.data.timeStamp + ')');
        let isClick = event.data.isClick
        let isClock = event.data.isClock

        if (isClick || isClock) {
            // this.click.execute(this)
            
            if (isClick) {
                this.stresser.doYourJob(this.counter, this.click, this)
            }
        
            if (isClock) {
                this.counter++
    
                console.log('this.counter',this.counter,'getCounter', getCounter(), 'getTimeLimit', getTimeLimit())
                if (getTimeLimitEnable() && getCounter() >= getTimeLimit()) { // >= getBeats()) {
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

        }

    }

    setSound(sound) {
        this.click = sound 
    }

    setStresser(stresser) {
        this.stresser = stresser
    }

    resetCounter() {
        this.counter = 1
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

        if (event.data.isClock) { 
            // console.log('[Node:Received] "' + event.data.message + '" (' + event.data.timeStamp + ')');
            const notFinished = !this.module.isFinished()
            if (notFinished && this.module.context.state === 'running') {
                this.clock.click() 
            } else {
                this.clock.stop()
            }

        }
        
    }

    setClock(clock) {
        this.clock = clock
    }

    setModule(m) {
        this.module = m
    }

}


