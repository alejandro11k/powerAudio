export class Sound {
    constructor(context) {        
        this.context = context
        this.gainNode = new GainNode(this.context)
    }

    getCurrentTime() {
        return this.context.currentTime
    }

    createOscillator (audioNode) {
        const oscillator = new OscillatorNode(this.context)
        
        this.gainNode.connect(audioNode)
        oscillator.connect(this.gainNode)

        return oscillator
    }
}

export class SoundType {

    constructor(sound) {
        this.sound = sound
    }

    execute(audioNode) {
        const currentTime = this.sound.getCurrentTime()
        const oscillator = this.sound.createOscillator(audioNode)
        oscillator.start(currentTime)
        this.doExecute(oscillator, currentTime)
        oscillator.stop(currentTime + this.stopDelta())
    }

    executeAt(time, audioNode) {
        const currentTime = time
        const oscillator = this.sound.createOscillator(audioNode.destination)
        oscillator.start(currentTime)
        this.doExecute(oscillator, currentTime)
        oscillator.stop(currentTime + this.stopDelta())
    }

}

export class Beeper extends SoundType {
    
    doExecute(oscillator, currentTime) {
        this.sound.gainNode.gain.value = 0.2
    }

    stopDelta() {
        return 0.1
    }
}

export class Kicker extends SoundType {
    
    doExecute(oscillator, currentTime) {
        oscillator.frequency.setValueAtTime(180, currentTime)
        this.sound.gainNode.gain.setValueAtTime(0.9, currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(0.01, currentTime + 0.1)
        this.sound.gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1)
    }
    
    stopDelta() {
        return 0.15
    }
}