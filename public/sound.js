export class Sound {
    constructor(context, audioNode) {
        
        this.context = context
        // this.oscillator = new OscillatorNode(context)
        console.log(this.context)
        this.gainNode = new GainNode(this.context)
        // this.oscillator.connect(this.gainNode)
        this.gainNode.connect(audioNode)

    }

    createOscillator () {
        // fix sound glitch
        const oscillator = null
        oscillator = new OscillatorNode(this.context)
        oscillator.connect(this.gainNode)

        return oscillator
    }

    execute() {

    }

}