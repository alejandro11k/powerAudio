import { Sound } from './sound.js'

export class Beeper extends Sound {
    constructor() {
        super()
    }
    
    execute() {
        const currentTime = this.context.currentTime   
        // prevent cannot call start more that once
        const oscillator = this.createOscillator()

        oscillator.start(currentTime)
        this.gainNode.gain.value = 0.2
        oscillator.stop(currentTime + 0.1)
    }
}