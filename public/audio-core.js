import { PortWorkletNode } from './port-worklet-node.js'
// import { PunchLib } from './punch-lib.js'

let context = new AudioContext();
let periodicity = 1
// let mainGainValue = 0.1
let gainNode = context.createGain();

export function init() {
    context.audioWorklet.addModule('./processor.js').then(() => {
        let portWorkletNode = new PortWorkletNode(context);
        //portWorkletNode.connect(context.destination);

        //this.currentPunch = new PunchLib(context, portWorkletNode)
        //portWorkletNode.getPunch(this.currentPunch.default)

        // mainGain(portWorkletNode)
        contextGainNode(portWorkletNode) // glitch?

        let paramAmp = portWorkletNode.parameters.get('amplitude');
        portWorkletNode.connect(paramAmp)

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
function contextGainNode(portWorkletNode) {
    portWorkletNode.connect(gainNode);
    gainNode.connect(context.destination);
    gainNode.gain.value = 0.09
}

async function createNewContext() {
    context = new AudioContext();
}

export function pause() {
    context.pause()
}

export function resume() {
    context.resume()
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
}
