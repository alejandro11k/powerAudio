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
        this.state.getSounds() // ??
    }

    setStressOne() {
        this.state.setStressOne = 0
    }

    setStressTwo() {
        this.state.setStressTwo = 0
    }

    setStressOnly() {
        console.log('statesNodes, setStressOnly')
        this.state.setStressOnly = false
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
        AudioCore.storeBpm(value)
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
    
    setTimeLimit(value) {
        AudioCore.setBeats(value)
    }

    seconds2Beats(value) {
        return value / 60
    }

    setStressOne(value) {
        this.state.setStressOne = value
    }

    setStressTwo(value) {
        this.state.setStressTwo = value
    }

    setStressOnly(value) {
        console.log('ContextAndGainNodes, setStressOnly')
        this.state.stressOnly = value
    }

}

class AllNodes {
    constructor() {
        AudioCore.init()
        console.log('start', AudioCore.getCurrentTime())
    }

    onOff() {
        AudioCore.suspendResume()
        console.log('start/end', AudioCore.getCurrentTime())
    }

    setBpm (value) {
        AudioCore.setBpm(value)
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

    setTimeLimit(value) {
        AudioCore.setBeats(value)
    }

    seconds2Beats(value) {
        return value / 60
    }

    setStressOne(value) {
        this.state.setStressOne = value
    }

    setStressTwo(value) {
        this.state.setStressTwo = value
    }

    setStressOnly(value) {
        console.log('AllNodes, setStressOnly')
        this.state.setStressOnly = value
    }

}
/*
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
*/