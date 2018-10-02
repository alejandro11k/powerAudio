import { PortWorkletNode } from './port-worklet-node.js'
import { Sound, Beeper, Kicker } from "./sound.js"

let context = new AudioContext();
let periodicity = 1
// let mainGainValue = 0.1
let gainNode = context.createGain();
let lastGainNodeValue = 1
let portWorkletNode = null

let sounds = new Map()
initSounds()
let click = sounds.get('beeper') 

export function init() {
    context.audioWorklet.addModule('./processor.js').then(() => {
        portWorkletNode = new PortWorkletNode(context);
        //portWorkletNode.connect(context.destination);

        //this.currentPunch = new PunchLib(context, portWorkletNode)
        //portWorkletNode.getPunch(this.currentPunch.default)

        // mainGain(portWorkletNode)
        contextGainNode(portWorkletNode, lastGainNodeValue) // glitch?

        /* 
        let paramAmp = portWorkletNode.parameters.get('amplitude');
        portWorkletNode.connect(paramAmp)
        */

        portWorkletNode.setSound(click)
        let param = portWorkletNode.parameters.get('periodicity')
        param.value = periodicity
    });
}

// LOST CONTEXT in 2nd inid !!! error
function initSounds() {

    const beeper = new Beeper(new Sound(context))
    const kicker = new Kicker(new Sound(context))

    sounds.set('beeper',beeper)
    sounds.set('kicker',kicker)
}

// Using context.createGain()
function contextGainNode(portWorkletNode, lastGainNodeValue) {
    portWorkletNode.connect(gainNode);
    gainNode.connect(context.destination);
    gainNode.gain.value = lastGainNodeValue //0.09
    console.log(lastGainNodeValue)
}

async function createNewContext() {
    context = new AudioContext();
}

export function stop() {
    context.close()
    createNewContext().then(()=>{
        gainNode = context.createGain();
    })
}

export function setPeriodicity(value) {
    periodicity = value
    console.log(value)
}

export function setMainGain(value) {
    gainNode.gain.value = value
    lastGainNodeValue = value
    console.log(value)
}

export function setSound(value) {
    console.log(value)
    
    click = value
}

export function getSounds() {
    return sounds
    // portWorkletNode.getSounds()
}

/*
export function pause() {
    context.pause()
}

export function resume() {
    context.resume()
}
*/