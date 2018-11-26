import { getCounter, stepCounter, getTimeLimitEnable, getTimeLimit} from './audio-core.js'

export class PortWorkletNode extends AudioWorkletNode {
    constructor(context) {
        super(context, 'processor');
        this.counter = 1;
        this.actualBeat = 1;
        this.port.onmessage = this.handleMessage.bind(this);
        this.port.postMessage({
            message: 'Are you ready?',
            timeStamp: this.context.currentTime
        });
    }

    handleMessage(event) {
        // console.log('[Node:Received] "' + event.data.message + '" (' + event.data.timeStamp + ')');
        let isClick = event.data.isClick
        let isClock = event.data.isClock

        if (isClick || isClock) {
            
            if (isClick) {
                this.stresser.doYourJob(this.actualBeat, this.click, this)
                this.actualBeat++
            }
        
            if (isClock) {
                this.counter++
                this.clock.clock()
    
                if (getTimeLimitEnable() && getCounter() >= getTimeLimit()) {
                    this.port.postMessage({
                        message: 'insert coin!',
                        timeStamp: this.context.currentTime
                    });
                    this.context.suspend()
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
    
    setClock(clock) {
        this.clock = clock
    }

    resetActualBeat() {
        this.actualBeat = 1
    }
    
}

export class ClockWorkletNode extends AudioWorkletNode {
    constructor(context) {
        super(context, 'processor');
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
                this.clock.clock() 
            } else {
                this.clock.stop()
            }
        }
        if (event.data.isTimeListTime) {
            this.clock.click()
        }
        
    }

    setTimeList(timeList) {
        this.port.postMessage({
            message: 'timeList',
            timeList: timeList
        });
    }

    setClock(clock) {
        this.clock = clock
    }

    setModule(m) {
        this.module = m
    }

}


