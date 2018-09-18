export class PunchLib {
    constructor(context) {
        this.oscillator = new OscillatorNode(context)
        this.gainNode = new GainNode(context)
        this.oscillator.connect(this.gainNode)
        this.gainNode.connect(this)
    }

    trigger() {
        const time = this.context.currentTime;
        this.oscillator.frequency.setValueAtTime(150, time);
        this.gainNode.gain.setValueAtTime(0.8, time);
    
        this.oscillator.frequency.exponentialRampToValueAtTime(0.1, time + 0.5);
        this.gainNode.gain.exponentialRampToValueAtTime(0.1, time + 0.5);
    }
    kick1 () {
        this.currentTime = this.context.currentTime
        console.log(this.currentTime)
        
        // prevent cannot call start more that once
        this.destroyOsc()

        this.oscillator.start(this.currentTime)
        this.oscillator.frequency.setValueAtTime(180, this.currentTime)
        this.gainNode.gain.setValueAtTime(0.9, this.currentTime)
        this.oscillator.frequency.exponentialRampToValueAtTime(0.01, this.currentTime + 0.1)
        this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.currentTime + 0.1)
        this.oscillator.stop(this.currentTime + 0.15)
        
    }
    beep1 () {
        const currentTime = this.context.currentTime
        // this.gainNode.gain.setValueAtTime(0.3, this.currentTime)
        // prevent cannot call start more that once
        this.destroyOsc()
        this.oscillator.start(currentTime)
        this.oscillator.stop(currentTime + 0.1)
    }
    destroyOsc () {
        // fix sound glitch
        this.oscillator = null
        this.oscillator = new OscillatorNode(this.context)
        this.oscillator.connect(this.gainNode)
    }
}