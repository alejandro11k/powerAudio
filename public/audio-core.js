import { PortWorkletNode } from './port-worklet-node.js'
import { Sound, Beeper, Kicker } from "./sound.js"
import { Stresser, Stress } from "./stresser.js"
import { Clock } from './clock.js';

let bpm = 60
let lastGainNodeValue = 80
let beats = 0
let timeLimit = 10
let timeLimitEnable = false
let counter = 1

let gainNode = null
let context = null
let portWorkletNode = null
let clock = new Clock()

let stresser = null
let stressOne = null
let stressTwo = null
let stressOneInterval = 0
let stressTwoInterval = 0
let stressOnly = false

export function createContextAndGainNode() {
    context = new AudioContext()
    gainNode = context.createGain()
}

let sounds = new Map()
let selectedSound = null

export function storeSelectedSound(value) {
    selectedSound = value
}

export function init() {
    context.audioWorklet.addModule('./processor.js').then(() => {
        portWorkletNode = new PortWorkletNode(context);
        contextGainNode(portWorkletNode, lastGainNodeValue)
        portWorkletNode.setClock(clock)

        let sound = selectedSound || sounds.get('beeper')
        portWorkletNode.setSound(sound)
        let param = portWorkletNode.parameters.get('bpm')
        param.value = bpm

        setBeats()
        beats++ // Fix

        stresser = new Stresser()
        stresser.stressOnly = stressOnly

        stressOne = new Stress()
        stressTwo = new Stress()
        stressOne.stressInterval = stressOneInterval
        stressTwo.stressInterval = stressTwoInterval

        stresser.addStress(stressOne)
        stresser.addStress(stressTwo)
        
        portWorkletNode.setStresser(stresser)

        selectStressersSounds()
    });
}

export function selectStressersSounds() {
    if (portWorkletNode.click.className === 'Beeper') {
        portWorkletNode.stresser.getStressOne().stressSound = sounds.get('beeper1220')
        portWorkletNode.stresser.getStressTwo().stressSound = sounds.get('kicker440')
    } else {
        portWorkletNode.stresser.getStressOne().stressSound = sounds.get('beeper880')
        portWorkletNode.stresser.getStressTwo().stressSound = sounds.get('beeper1220')
    }
}

export function setStressOnly(bool) {
    stressOnly = bool
    if (portWorkletNode!==null) {
        portWorkletNode.stresser.setStressOnly(bool)
    }
}

export function setStressOneInterval(number) {
    stressOneInterval = number
    if (portWorkletNode!==null) {
        portWorkletNode.stresser.getStressOne().stressInterval = number
        portWorkletNode.resetActualBeat()
    }
}

export function setStressTwoInterval(number) {
    stressTwoInterval = number
    if (portWorkletNode!==null) {
        portWorkletNode.stresser.getStressTwo().stressInterval = number
        portWorkletNode.resetActualBeat()
    }
}

export function initSounds() {
    const beeper = new Beeper(new Sound(context))
    const kicker = new Kicker(new Sound(context))

    // beeper.dispatchEvent = true
    // kicker.dispatchEvent = true
    
    sounds.set('beeper',beeper)
    sounds.set('kicker',kicker)
    
    const kicker440 = new Kicker(new Sound(context))
    const kicker880 = new Kicker(new Sound(context))
    const kicker1440 = new Kicker(new Sound(context))
    
    kicker440.setOscillatorFrequency(440)
    kicker880.setOscillatorFrequency(880)
    kicker1440.setOscillatorFrequency(1440)
    
    sounds.set('kicker440',kicker440)
    sounds.set('kicker880',kicker880)
    sounds.set('kicker1440',kicker1440)

    const beeper880 = new Beeper(new Sound(context))
    beeper880.setOscillatorFrequency(880)
    sounds.set('beeper880',beeper880)

    const beeper1220 = new Beeper(new Sound(context))
    beeper1220.setOscillatorFrequency(1220)
    sounds.set('beeper1220',beeper1220)
}

function contextGainNode(portWorkletNode, lastGainNodeValue) {
    portWorkletNode.connect(gainNode);
    gainNode.connect(context.destination);
    gainNode.gain.value = input2GainValue(lastGainNodeValue) //0.09
}

function input2GainValue(value) {
    const gainValue = (value * 1.2) / 100
    return gainValue
}

export function suspendResume() {
    if(context.state === 'running') {
        portWorkletNode.resetCounter();
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
    portWorkletNode.resetActualBeat()
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

export function getTimeLimit() {
    return timeLimit
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


