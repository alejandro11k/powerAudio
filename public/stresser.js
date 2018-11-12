export class Stresser {
    constructor() {
        this.stressers = [] // list of stress class
        this.onlyStress = false
        this.isOn = false
    }

    doYourJob(actualBeat, selectedClick, aundioNode) {
        const soundsToExecute = this.nextSound(actualBeat, selectedClick)
        this.execute(soundsToExecute, aundioNode)
    }

    nextSound(actualBeat, selectedClick) {
        const soundsToExecute = [selectedClick]
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

}

class Stress {
    constructor() {
        this.stressSound = null // sound type
        this.stressBeat = null // int
    }

    isRightNow(actualBeat) {
        let retValue = false
        if (actualBeat === this.stressBeat) {
            retValue = true
        }
        return retValue
    }
    
}