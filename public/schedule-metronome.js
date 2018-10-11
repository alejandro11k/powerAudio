export class ScheduleMetronome {
    constructor() {
        // threeTimesAt60bpm()
        let audioContext = null
        let lista = []
        lista.push('sarasa')
        console.log(lista)
        
    }

    test() {
        this.setLista()
        this.add(90,0.1)
        this.add(120,0.1)
        this.add(180,0.1)
        this.playList()
    }

    setLista() {
        this.lista = []
    }

    getLista() {
        return this.lista
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

    add(bpm, minutes) {
        // this.inputMinutes(bpm, minutes, this.audioContext)
        console.log(this.getLista())
        this.lista.push({ 'bpm':bpm, 'minutes':minutes})
    }

    playList() {
        let audioContext = new AudioContext()
        console.log(this.getLista())
        let playListFix = null
        audioContext.audioWorklet.addModule('./processor.js').then(() => {
            this.getLista().forEach(element => {
                this.inputMinutes(element.bpm, element.minutes, audioContext)
            });
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

    async inputMinutes(bpm, minutes, audioContext) {
        const delay = this.bpm2seg(bpm)
        let beats = this.minutes2Beats(minutes, delay)

        console.log('delay', delay, 'beats', beats)
        let beat = this.playListFix || 0
        this.playListFix = beat
        for (let times = 1; times < beats+1; times++) {
            beat = beat + delay
            this.play(beat, 3, 0.1, audioContext)
            console.log('pulso: ', beat, 'iteracion: ', times)
        }
        this.playListFix = this.playListFix + beats + 1
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
