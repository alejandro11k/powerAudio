import * as AudioCore from './audio-core.js'

export class StateNodes {
    constructor() {
        this.state = new ContextAndGainNodes()
        this.selectedSound = null
    }
    
    onOff() {
        this.state.onOff(this)
    }

    setState(newState) {
        this.state = newState
    }

    setBpm(value) {
        this.state.setBpm(value)
    }

    setSound(value) {
        this.state.setSound(value)
    }

    setGain(value) {
        this.state.setGain(value)
    }

    getSounds() {
        this.state.getSounds()
    }
}

class NullNodes {
    constructor() {

    }

    onOff(context) {
       // SetNewState
       // context.setState(new ContextAndGainNodes())
    }

    setBpm(value) {
        // guardar el valor para darselo al proximo estado
    }

    setSound(value) {
        // guardar el valor para darselo al proximo estado
    }

    setGain(value) {
        // guardar el valor para darselo al proximo estado
    }

    getSounds() {
        // ??
    }
    
}

class ContextAndGainNodes {
    constructor() {
        AudioCore.createContextAndGainNode()
        AudioCore.initSounds()
    }

    onOff(context) {
       context.setState(new AllNodes())
    }

    setBpm(value) {
        // guardar el valor para darselo al proximo estado
        AudioCore.storePeriodicity(value)
    }

    setSound(value) {
        // guardar el valor para darselo al proximo estado
        AudioCore.storeSelectedSound(value)
    }

    setGain(value) {
        AudioCore.setMainGain(value)
    }

    getSounds() {
        return AudioCore.getSounds()
    }
    
}

class AllNodes {
    constructor() {
        AudioCore.init()
    }

    onOff() {
        AudioCore.suspendResume()
    }

    setBpm (value) {
        AudioCore.setPeriodicity(value)
    }

    setSound(value) {
        AudioCore.setSound(value)
    }

    setGain(value) {
        AudioCore.setMainGain(value)
    }

    getSounds() {
        AudioCore.getSounds()
    }

}