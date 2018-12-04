export class Stresser {
    constructor() {
        this.stressers = [] // list of stress class
        this.stressOnly = false
        this.isOn = false
        this.event = new Event('SoundExecute');
    }

    doYourJob(actualBeat, selectedClick, aundioNode) {
        const soundsToExecute = this.nextSound(actualBeat, selectedClick)
        dispatchEvent(this.event)
        this.execute(soundsToExecute, aundioNode)
    }

    nextSound(actualBeat, selectedClick) {
        const soundsToExecute = this.stressOnly? [] : [selectedClick]
        this.stressers.forEach((stress) => {
            stress.isRightNow(actualBeat) ? soundsToExecute.push(stress.stressSound) : null
        })
        return soundsToExecute // arrays of soundTypes
    }

    execute(soundsToExecute, aundioNode) {
        soundsToExecute.forEach((sound)=> {
            sound.execute(aundioNode)
        })
    }

    addStress(stress) {
        this.stressers.push(stress)
    }

    setStressOnly(value) {
        this.stressOnly = value
    }

    getStressOne() {
        return this.stressers[0]
    }

    getStressTwo() {
        return this.stressers[1]
    }

}

export class Stress {
    constructor() {
        this.stressSound = null // sound type
        this.stressInterval = null // int
    }

    isRightNow(actualBeat) {
        let retValue = false
        if ((actualBeat === 1 && this.stressInterval !== 0)|| (actualBeat-1)  % this.stressInterval === 0) {
            retValue = true
        }
        return retValue
    }
    
}
