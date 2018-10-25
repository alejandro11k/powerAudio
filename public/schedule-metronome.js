import { Sound, Beeper, Kicker } from "./sound.js"

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
        // console.log('delay', delay, 'beats', beats, 'beat', beat)
        
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

export class ScheduleModule {
    constructor() {
        this.context = null
        this.gainNode = null
        this.beeper = null
        this.kicker = null
    }

    script() {
        this.createContextAndGainNode()
        this.initSounds()
        // const start = 0

        // let s1 = new Schedule(60, 30, start, this.beeper)
        // let s2 = new Schedule(120, 30, s1.getLatsBeat(), this.beeper)

        let s1 = new Schedule(60, 30, this.beeper)
        let s2 = new Schedule(120, 30, this.beeper)

        console.log(s1)
        console.log(s2)

        let sl1 = new ScheduleList(s1)
        sl1.addNext(s2)

        this.context.audioWorklet.addModule('./processor.js').then(() => {
            // s1.execute(this.context)
            // s2.execute(this.context)
            sl1.execute(this.context)
        })
        
    }

    initSounds() {
        this.beeper = new Beeper(new Sound(this.context))
        this.kicker = new Kicker(new Sound(this.context))
    }

    createContextAndGainNode() {
        this.context = new AudioContext()
        this.gainNode = this.context.createGain()
    }

    stop() {
        this.audioContext.suspend()
    }
}

export class Schedule {
    constructor(bpm, seconds, sound) {
        this.bpm = bpm
        this.seconds = seconds
        this.sound = sound
        this.lastBeat = 0
        this.start = 0
        this.timeList = this.calculateTimeList(bpm, seconds, this.start)
    }

    reInitialize(start) {
        this.setStart(start)
        this.timeList = this.calculateTimeList(this.bpm, this.seconds, start)
    }

    setStart(start) {
        this.start = start
    }

    getLatsBeat() {
        return this.lastBeat
    }

    execute(audioNode) {
        this.timeList.forEach(element => {
            this.playBeat(element,audioNode)
        });
    }

    playBeat(time,audioNode) {
        this.sound.executeAt(time,audioNode)
    }

    calculateTimeList(bpm, seconds) {
        const timeList = []

        const delay = this.bpm2seg(bpm)
        const beats = this.seconds2Beats(seconds, delay)
        let beat = this.start - delay
        
        for (let times = 1; times < beats+1; times++) {
            beat = beat + delay
            timeList.push(beat)
        }

        this.lastBeat = beat + delay

        return timeList
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

    seconds2Beats(seconds, delay) {
        const times = seconds / delay
        return times 
    }
}


export class ScheduleList {
    constructor(schedule) {
        this.schedule = schedule
        this.nextSchedule = null
    }

    addNext(schedule) {
        this.nextSchedule = new ScheduleList(schedule)
    }

    remove() {
        //
    }

    execute(audioNode) {
        this.schedule.execute(audioNode)
        if(this.nextSchedule!==null){
            console.log(this.nextSchedule)
            this.nextSchedule.schedule.reInitialize(this.schedule.getLatsBeat())
            this.nextSchedule.execute(audioNode)
        }
    }

    getMapOfSchedules() {
        m_schedules = new Map() 
        for (let i in this.schedule) {
            for (let e of this.shcedule) {
                m_schedules.set(i, e)
            }
        }
        return m_schedules //entries()
    }
}