export class Sound {
    constructor(context, audioNode) {
        
        this.context = context
        // this.oscillator = new OscillatorNode(context)
        console.log(this.context)
        this.gainNode = new GainNode(this.context)
        // this.oscillator.connect(this.gainNode)
        this.gainNode.connect(audioNode)

    }

    createOscillator () {
        // fix sound glitch
        let oscillator = null
        oscillator = new OscillatorNode(this.context)
        oscillator.connect(this.gainNode)

        return oscillator
    }

}

export class Beeper{
    constructor(sound) {
        this.sound = sound
    }
    
    execute() {
        const currentTime = this.sound.context.currentTime   
        // prevent cannot call start more that once
        const oscillator = this.sound.createOscillator()

        oscillator.start(currentTime)
        this.sound.gainNode.gain.value = 0.2
        oscillator.stop(currentTime + 0.1)
    }
}

export class Kicker {
    constructor(sound) {
        this.sound = sound
    }
    
    execute() {
        let currentTime = this.sound.context.currentTime
        const oscillator = this.sound.createOscillator()
        oscillator.start(this.currentTime)
        oscillator.frequency.setValueAtTime(180, currentTime)
        this.sound.gainNode.gain.setValueAtTime(0.9, currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(0.01, currentTime + 0.1)
        this.sound.gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1)
        oscillator.stop(currentTime + 0.15)
    }
    
}