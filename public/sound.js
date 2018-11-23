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
        this.className = "SoundType"
        this.sound = sound
        this.event = new Event('SoundExecute');
        this.oscillatorFrequency = null
    }

    setOscillatorFrequency(frequency) {
        this.oscillatorFrequency = frequency
    }

    execute(audioNode) {
        const currentTime = this.sound.getCurrentTime()
        const oscillator = this.sound.createOscillator(audioNode)
        oscillator.start(currentTime)
        this.doExecute(oscillator, currentTime)
        oscillator.stop(currentTime + this.stopDelta())
        dispatchEvent(this.event)
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

    constructor(sound) {
        super(sound)
        this.className = "Beeper"
        this.setOscillatorFrequency(440)
    }
    
    doExecute(oscillator, currentTime) {
        oscillator.frequency.setValueAtTime(this.oscillatorFrequency, currentTime);
        this.sound.gainNode.gain.value = 0.2
    }

    stopDelta() {
        return 0.1
    }
}

export class Kicker extends SoundType {

    constructor(sound) {
        super(sound)
        this.className = "Kicker"
        this.setOscillatorFrequency(180)
    }
    
    doExecute(oscillator, currentTime) {
        oscillator.frequency.setValueAtTime(this.oscillatorFrequency, currentTime)
        this.sound.gainNode.gain.setValueAtTime(0.9, currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(0.01, currentTime + 0.1)
        this.sound.gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1)
    }
    
    stopDelta() {
        return 0.15
    }
}
