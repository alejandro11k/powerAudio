export class ScheduleMetronome {
    constructor() {
        // threeTimesAt60bpm()
        let audioContext = null
    }

    threeTimesAt60bpm() {
        let audioContext = new AudioContext()
        audioContext.audioWorklet.addModule('./processor.js').then(() => {
            this.play(0, 3, 0.5, audioContext)
            this.play(1, 3, 0.5, audioContext)
            this.play(2, 3, 0.5, audioContext)
        })
    }

    schedule(bpm, minutes) {
        let audioContext = new AudioContext()
        audioContext.audioWorklet.addModule('./processor.js').then(() => {
            this.inputMinutes(bpm, minutes, audioContext)
        })
    }
    
    play (delay, pitch, duration, audioContext) {
      var startTime = audioContext.currentTime + delay
      var endTime = startTime + duration
      
      var oscillator = audioContext.createOscillator()
      oscillator.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(pitch * 220, startTime)
      
      oscillator.start(startTime)
      oscillator.stop(endTime)
    }

    inputMinutes(bpm, minutes, audioContext) {
        const delay = this.bpm2seg(bpm)
        let beats = this.minutes2Beats(minutes, delay)

        console.log('delay', delay, 'beats', beats)
        let beat = 0
        // for (let beat = 0; beat < beats; beat = beat + delay) {
        for (let times = 1; times < beats+1; times++) {
            beat = beat + delay
            this.play(beat, 3, 0.1, audioContext)
            console.log('pulso: ', beat, 'iteracion: ', times)
        }

        this.audioContext = audioContext

    }

    stop() {
        this.audioContext.suspend()
    }

    bpm2seg(bpm) {
        const second = (60 / bpm);
        return second
    }

    minutes2Beats(minutes, delay) {
        const seconds = minutes * 60
        const times = seconds / delay
        return times 
    }

}
