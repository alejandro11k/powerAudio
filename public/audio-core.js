import { PortWorkletNode } from './port-worklet-node.js'
import { Sound, Beeper, Kicker } from "./sound.js"

let context = new AudioContext();
let periodicity = 1
let gainNode = context.createGain();
let lastGainNodeValue = 1
let portWorkletNode = null

let sounds = new Map()
initSounds()

export function init() {
    context.audioWorklet.addModule('./processor.js').then(() => {
        portWorkletNode = new PortWorkletNode(context);
        contextGainNode(portWorkletNode, lastGainNodeValue)

        portWorkletNode.setSound(sounds.get('beeper'))
        let param = portWorkletNode.parameters.get('periodicity')
        param.value = periodicity

    });
}

function initSounds() {
    const beeper = new Beeper(new Sound(context))
    const kicker = new Kicker(new Sound(context))
    sounds.set('beeper',beeper)
    sounds.set('kicker',kicker)
}

function contextGainNode(portWorkletNode, lastGainNodeValue) {
    portWorkletNode.connect(gainNode);
    gainNode.connect(context.destination);
    gainNode.gain.value = lastGainNodeValue //0.09
    console.log(lastGainNodeValue)
}

export function start() {
    context.resume()
}
export function stop() {
    context.suspend()
}

export function setPeriodicity(value) {
    let param = portWorkletNode.parameters.get('periodicity')
    param.value = value

    periodicity = value
}

export function setMainGain(value) {
    gainNode.gain.value = value
    lastGainNodeValue = value
    console.log(value)
}

export function setSound(value) {
    portWorkletNode.setSound(value)
}

export function getSounds() {
    return sounds
}
