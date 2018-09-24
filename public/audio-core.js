import { PortWorkletNode } from './port-worklet-node.js'
// import { PunchLib } from './punch-lib.js'

let context = new AudioContext();
let periodicity = 1
// let mainGainValue = 0.1
let gainNode = context.createGain();
let lastGainNodeValue = 1
let click = 'beep'

export function init() {
    context.audioWorklet.addModule('./processor.js').then(() => {
        let portWorkletNode = new PortWorkletNode(context, click);
        //portWorkletNode.connect(context.destination);

        //this.currentPunch = new PunchLib(context, portWorkletNode)
        //portWorkletNode.getPunch(this.currentPunch.default)

        // mainGain(portWorkletNode)
        contextGainNode(portWorkletNode, lastGainNodeValue) // glitch?

        /* 
        let paramAmp = portWorkletNode.parameters.get('amplitude');
        portWorkletNode.connect(paramAmp)
        */

        let param = portWorkletNode.parameters.get('periodicity')
        param.value = periodicity
    });
}

// Using a new gainNode on the top of the chain
function mainGain(portWorkletNode) {
    let mainGain = new GainNode(context)
    portWorkletNode.connect(mainGain);
    mainGain.connect(context.destination)
    // min audible value 0.003
    mainGain.gain.value = 0.09
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

export function setClick(value) {
    console.log(value)
    click = value

}

/*
export function pause() {
    context.pause()
}

export function resume() {
    context.resume()
}
*/