export class ScheduleMetronome {
    constructor() {
        // threeTimesAt60bpm()
    }

    threeTimesAt60bpm() {
        let audioContext = new AudioContext()
        audioContext.audioWorklet.addModule('./processor.js').then(() => {
            this.play(0, 3, 0.5, audioContext)
            this.play(1, 3, 0.5, audioContext)
            this.play(2, 3, 0.5, audioContext)
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

}
