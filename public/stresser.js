export class Stresser {
    constructor() {
        this.stressers = [] // list of stress class
        this.stressOnly = false
        this.isOn = false
    }

    doYourJob(actualBeat, selectedClick, aundioNode) {
        const soundsToExecute = this.nextSound(actualBeat, selectedClick)
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

}

export class Stress {
    constructor() {
        this.stressSound = null // sound type
        this.stressInterval = null // int
    }

    isRightNow(actualBeat) {
        let retValue = false
        if (actualBeat === 1 || (actualBeat-1)  % this.stressInterval === 0) {
            retValue = true
        }
        return retValue
    }
    
}
