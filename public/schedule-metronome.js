import { Sound, Beeper, Kicker } from "./sound.js"

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

        let s1 = new Schedule(60, 30, this.beeper)
        let s2 = new Schedule(120, 30, this.beeper)

        console.log(s1)
        console.log(s2)

        let sl1 = new ScheduleList(s1)
        sl1.addNext(s2)

        this.context.audioWorklet.addModule('./processor.js').then(() => {
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
        if(!this.lastSchedule()){
            this.nextSchedule.schedule.reInitialize(this.schedule.getLatsBeat())
            this.nextSchedule.execute(audioNode)
        }
    }

    lastSchedule() {
        return this.nextSchedule===null
    }
}