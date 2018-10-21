import { PortWorkletNode } from './port-worklet-node.js'
import { Sound, Beeper, Kicker } from "./sound.js"


let bpm = 60
let lastGainNodeValue = 80
let beats = 0
let timeLimit = 0
let timeLimitEnable = false
let counter = 1

let gainNode = null
let context = null
let portWorkletNode = null

export function createContextAndGainNode() {
    context = new AudioContext()
    gainNode = context.createGain()
}

let sounds = new Map()
let selectedSound = null

export function storeSelectedSound(value) {
    selectedSound = value
    console.log(selectedSound)
}

export function init() {
    context.audioWorklet.addModule('./processor.js').then(() => {
        portWorkletNode = new PortWorkletNode(context);
        contextGainNode(portWorkletNode, lastGainNodeValue)

        let sound = selectedSound || sounds.get('beeper')
        portWorkletNode.setSound(sound)
        let param = portWorkletNode.parameters.get('bpm')
        param.value = bpm

        setBeats()
        beats++ // Fix
    });
}

export function initSounds() {
    const beeper = new Beeper(new Sound(context))
    const kicker = new Kicker(new Sound(context))
    sounds.set('beeper',beeper)
    sounds.set('kicker',kicker)
}

function contextGainNode(portWorkletNode, lastGainNodeValue) {
    portWorkletNode.connect(gainNode);
    gainNode.connect(context.destination);
    gainNode.gain.value = input2GainValue(lastGainNodeValue) //0.09
}

function input2GainValue(value) {
    const gainValue = (value * 1.2) / 100
    console.log('input', value, 'gainValue', gainValue)
    return gainValue
}

export function suspendResume() {
    if(context.state === 'running') {
        context.suspend().then(function() {
            return 'Resume context';
      });
    } else if(context.state === 'suspended') {
        
        setBeats()
        resetCounter()

        context.resume().then(function() {
            return 'Suspend context';
      });  
    }
}

export function setBpm(value) {
    bpm = value
    let param = portWorkletNode.parameters.get('bpm')
    param.value = bpm
}

export function storeBpm(value) {
    bpm = value
}

export function setMainGain(value) {
    gainNode.gain.value = input2GainValue(value)
    lastGainNodeValue = value
}

export function setSound(value) {
    portWorkletNode.setSound(value)
}

export function getSounds() {
    return sounds
}

export function getCurrentTime() {
    return context.currentTime
}

export function getBeats() {
    return beats
}

export function setTimeLimit (segundos) {
    timeLimit = segundos
}

export function setBeats() {
    let intervaloEnSegundos = 60 / bpm
    let cantidadDeBeats = timeLimit / intervaloEnSegundos
    
    beats = cantidadDeBeats
}

export function setTimeLimitEnable (value) {
    timeLimitEnable = value
}

export function getTimeLimitEnable () {
    return timeLimitEnable
}

export function getCounter() {
    return counter
}

export function stepCounter() {
    counter++
}

export function resetCounter() {
    counter = 1
}


