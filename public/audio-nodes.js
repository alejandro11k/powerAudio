import * as AudioCore from './audio-core.js'

export class StateNodes {
    constructor() {
        this.state = new ContextAndGainNodes()
    }
    
    onOff() {
        this.state.onOff(this)
    }

    setState(newState) {
        this.state = newState
    }

    setBmp(value) {
        this.state.setBmp(value)
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

    onOff() {
       //SetNewState
    }

    setBmp(value) {
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
        //setNewState
    }

    setBmp(value) {
        // guardar el valor para darselo al proximo estado
    }

    setSound(value) {
        // guardar el valor para darselo al proximo estado
        console.log('setSound')
    }

    setGain(value) {
        AudioCore.setMainGain(value)
    }

    getSounds() {
        console.log(AudioCore.getSounds())
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

    setBmp(value) {
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