export class ScheduleMetronome {
    constructor() {
        let audioContext = null
        let list = []
        let lastBeat = 0
    }

    setLastBeat() {
        this.lastBeat = 0
    }

    setlist() {
        this.list = []
    }

    test() {
        this.setlist()
        this.setLastBeat()
        this.add(90,0.1)
        this.add(120,0.1)
        this.add(180,0.1)
        this.playList()
    }

    add(bpm, minutes) {
        this.list.push({ 'bpm':bpm, 'minutes':minutes})
    }

    playList() {
        let audioContext = new AudioContext()
        audioContext.audioWorklet.addModule('./processor.js').then(() => {
            this.list.forEach(element => {
                this.playBeats(element.bpm, element.minutes, audioContext)
            });
            this.lastBeat = 0
        })
    }
    
    playBeats(bpm, minutes, audioContext) {
        let interval = 1
        const delay = this.bpm2seg(bpm)
        let beats = this.minutes2Beats(minutes, delay)
        let beat = this.lastBeat
        console.log('delay', delay, 'beats', beats, 'beat', beat)
        
        for (let times = 1; times < beats+1; times++) {
            beat = beat + delay
            this.playBeat(beat, 3, 0.1, audioContext)
            // console.log('pulso: ', beat, 'iteracion: ', times)
        }

        this.lastBeat = beat + interval
        this.audioContext = audioContext
        
    }

    playBeat (delay, pitch, duration, audioContext) {
      var startTime = audioContext.currentTime + delay
      var endTime = startTime + duration
      
      var oscillator = audioContext.createOscillator()
      oscillator.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(pitch * 220, startTime)
      
      oscillator.start(startTime)
      oscillator.stop(endTime)
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
