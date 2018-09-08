'use strict'

// import PortWorkletNode from './port-worklet-node'
// import PortWorkletNode from './static/port-worklet-node.js'

function Demo1 () {
  this.modo = undefined
  this.context = new AudioContext()
  this.context.audioWorklet.addModule('./static/bypass-processor.js').then(() => {
    this.oscillator = new OscillatorNode(this.context)
    this.gainNode = new GainNode(this.context)
    this.bypasser = new AudioWorkletNode(this.context, 'bypass-processor')
    // this.portWorkletNode = new PortWorkletNode(this.context)
    this.oscillator.connect(this.gainNode)
    this.gainNode.connect(this.context.destination)
    // console.log(new PortWorkletNode(this.context, 'bypass-processor'))
  })
}

Demo1.prototype.getModo = function () {
  return this.modo
}

Demo1.prototype.setModo = function (modo) {
  this.modo = modo
}

Demo1.prototype.getOscillator = function () {
  return this.oscillator
}

Demo1.prototype.start = function () {
  // this.oscillator.connect(this.context.destination)
}

Demo1.prototype.disconnect = function () {
  // this.oscillator.stop()
  // this.oscillator.disconnect(this.context.destination)
}

Demo1.prototype.pulse = function () {
  this.currentTime = this.context.currentTime
  // console.log(this.currentTime)
  this.gainNode.gain.value = 5
  this.oscillator.frequency.value = 220
  while (this.context.currentTime < this.currentTime + 0.2) {
  }
  this.gainNode.gain.value = 0
  // this.gainNode.gain.exponentialRampToValueAtTime(0.1, this.currentTime + 0.5)
}

Demo1.prototype.times = function (times, space) {
  for (let i = 1; i < times; i++) {
    this.pulse()
    this.currentTime = this.context.currentTime
    while (this.context.currentTime < this.currentTime + space) {
    }
  }
}

Demo1.prototype.kicktimes = function (times, space) {
  for (let i = 1; i < times; i++) {
    this.trigger()
    this.currentTime = this.context.currentTime
    while (this.context.currentTime < this.currentTime + space) {
    }
  }
}

Demo1.prototype.getOscillator = function () {
  return this.oscillator
}

Demo1.prototype.destroyOsc = function () {
  this.oscillator = null
  this.oscillator = new OscillatorNode(this.context)
}

Demo1.prototype.trigger = function () {
  this.oscillator.start()
  this.currentTime = this.context.currentTime
  // console.log(this.currentTime)
  this.oscillator.frequency.setValueAtTime(150, this.currentTime)
  this.gainNode.gain.setValueAtTime(0.8, this.currentTime)
  this.oscillator.frequency.exponentialRampToValueAtTime(0.01, this.currentTime + 0.5)
  this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.currentTime + 0.5)
  while (this.context.currentTime < this.currentTime + 0.55) {
  }
  this.gainNode.disconnect(this.context.destination)
  this.oscillator.disconnect(this.gainNode)
  this.destroyOsc()
  this.oscillator.connect(this.gainNode)
  this.gainNode.connect(this.context.destination)
}

Demo1.prototype.destroy = function () {
  this.oscillator.disconnect(this.gainNode)
  this.oscillator = null
  this.oscillator = new OscillatorNode(this.context)
  this.oscillator.connect(this.gainNode)
}

Demo1.prototype.create = function (modo) {
  // this.oscillator.start()
  // this.currentTime = this.context.currentTime
  // this.oscillator.start(this.currentTime)
  // console.log(this.currentTime)
  switch (modo) {
    case 'kick1':
      this.kick1()
      break
    case 'beep1':
      this.beep1()
      break
    default:
      break
  }
}

Demo1.prototype.kick1 = function () {
  this.currentTime = this.context.currentTime
  // console.log(this.currentTime)
  this.oscillator.start(this.currentTime)
  this.oscillator.frequency.setValueAtTime(180, this.currentTime)
  this.gainNode.gain.setValueAtTime(0.9, this.currentTime)
  this.oscillator.frequency.exponentialRampToValueAtTime(0.01, this.currentTime + 0.1)
  this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.currentTime + 0.1)
  this.oscillator.stop(this.currentTime + 0.15)
}

Demo1.prototype.beep1 = function () {
  this.currentTime = this.context.currentTime
  // console.log(this.currentTime)
  // this.gainNode.gain.setValueAtTime(0.3, this.currentTime)
  this.oscillator.start(this.currentTime)
  this.oscillator.stop(this.currentTime + 0.1)
}

export default new Demo1()

/*
class PortWorkletNode extends AudioWorkletNode {
  PortWorkletNode (context) {
    super.AudioWorkletNode(context, 'port-processor')
    this.counter = 0
    this.port.onmessage = this.handleMessage.bind(this)
    this.port.postMessage({
      message: 'Are you ready?',
      timeStamp: this.context.currentTime
    })
  }
  handleMessage (event) {
    this.counter++
    console.log('[Node:Received] "' + event.data.message +
                '" (' + event.data.timeStamp + ')')
    // Notify the processor when the node gets 10 messages. Then reset the
    // counter.
    if (this.counter > 10) {
      this.port.postMessage({
        message: '10 messages!',
        timeStamp: this.context.currentTime
      })
      this.counter = 0
    }
  }
}
*/
