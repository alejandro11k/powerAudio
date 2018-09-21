export class PunchLib {
    constructor(context, audioNode) {
        
        this.context = context
        // this.audioNode = audioNode
        this.oscillator = new OscillatorNode(this.context)
        this.gainNode = new GainNode(this.context)
        this.oscillator.connect(this.gainNode)
        
        this.gainNode.connect(audioNode)

    }

    beep1 () {
        const currentTime = this.context.currentTime   
        // prevent cannot call start more that once
        this.destroyOsc()

        this.oscillator.start(currentTime)
        this.gainNode.gain.value = 0.2
        this.oscillator.stop(currentTime + 0.1)
    }

    kick1 () {
        console.log('kick')
        this.currentTime = this.context.currentTime
        
        // prevent cannot call start more that once
        this.destroyOsc()

        this.oscillator.start(this.currentTime)
        this.oscillator.frequency.setValueAtTime(180, this.currentTime)
        this.gainNode.gain.setValueAtTime(0.9, this.currentTime)
        this.oscillator.frequency.exponentialRampToValueAtTime(0.01, this.currentTime + 0.1)
        this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.currentTime + 0.1)
        this.oscillator.stop(this.currentTime + 0.15)
        
    }

    destroyOsc () {
        // fix sound glitch
        this.oscillator = null
        this.oscillator = new OscillatorNode(this.context)
        this.oscillator.connect(this.gainNode)
    }

    /*
    trigger() {
        const time = this.context.currentTime;
        this.oscillator.frequency.setValueAtTime(150, time);
        this.gainNode.gain.setValueAtTime(0.8, time);
    
        this.oscillator.frequency.exponentialRampToValueAtTime(0.1, time + 0.5);
        this.gainNode.gain.exponentialRampToValueAtTime(0.1, time + 0.5);
    }
    */

}