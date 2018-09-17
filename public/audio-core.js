import { PortWorkletNode } from './port-worklet-node.js'

let context = new AudioContext();
let periodicity = 1

export function init() {
    context.audioWorklet.addModule('./processor.js').then(() => {
        let portWorkletNode = new PortWorkletNode(context);
        //portWorkletNode.connect(context.destination);

        // playing w mainGain node
        // need to be on the top of the chain
        let mainGain = new GainNode(context)
        portWorkletNode.connect(mainGain);
        mainGain.connect(context.destination)
        // min audible value 0.003
        mainGain.gain.value = 0.09

        let param = portWorkletNode.parameters.get('periodicity')
        param.value = periodicity
    });
}
export function stop() {
    context.close()
    context = new AudioContext();
}

export function setPeriodicity(value) {
    periodicity = value
    console.log(value)
}