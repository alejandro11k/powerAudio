import { Sound, Beeper, Kicker } from "./sound.js"

export class ScheduleModule {
    constructor() {
        this.context = null
        this.gainNode = null
        this.beeper = null
        this.kicker = null
        this.sounds = new Map()
        this.sl = null
        this.played = false
        // this.context = new AudioContext() // same old error!
        // this.initSounds()
    }

    suspendResume() {
        console.log('stateBefore', this.context.state)
        if(this.context.state === 'running') {
            this.context.suspend().then(function() {
                return 'Resume context';
          });
        } else if(this.context.state === 'suspended') {
            this.context.resume().then(function() {
                return 'Suspend context';
          });  
        }
    }

    playTest(schedules) {
        this.createContextAndGainNode()
        this.initSounds()
        const firstSchedule = schedules[0]
        this.sl = new ScheduleList(
            new Schedule(
                firstSchedule[0],
                firstSchedule[1],
                this.sounds.get(firstSchedule[2])
            ))
        schedules.splice(0,1)
        schedules.forEach((schedule)=>{
            this.sl.addNext(new Schedule(schedule[0],schedule[1],this.sounds.get(schedule[2])))
        })

        this.play()
    }

    add(bpm, time, sound) {
        if (this.sl===null) {
            this.createContextAndGainNode()
            this.initSounds()
            let s = new Schedule(bpm, time, this.sounds.get(sound))
            this.sl = new ScheduleList(s)
        } else {
            let s = new Schedule(bpm, time, this.sounds.get(sound))
            this.sl.addNext(s)
        }
    }

    play() {
        if (!this.played) {
            this.context.audioWorklet.addModule('./processor.js').then(() => {
                this.sl.execute(this.context)
                this.played = true
            })
        } else {
            this.sl.execute(this.context)
        }
        
    }

    initSounds() {
        this.beeper = new Beeper(new Sound(this.context))
        this.kicker = new Kicker(new Sound(this.context))
        this.sounds.set('beeper', this.beeper)
        this.sounds.set('kicker', this.kicker)
    }

    createContextAndGainNode() {
        this.context = new AudioContext()
        this.gainNode = this.context.createGain()
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

    // To use with Schedules without Sounds
    simplePlayBeat (time, audioContext) {
        var startTime = time //audioContext.currentTime + delay
        var endTime = time + 0.1
        var pitch = 2
        
        var oscillator = audioContext.createOscillator()
        oscillator.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(pitch * 220, startTime)
        
        oscillator.start(startTime)
        oscillator.stop(endTime)
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
        if(this.lastSchedule()){
          this.nextSchedule = new ScheduleList(schedule)
        } else {
            this.nextSchedule.addNext(schedule)
        }
    }

    remove() {
        //
    }

    execute(audioNode) {
        this.schedule.execute(audioNode)
        console.log('beats to play', this.schedule.timeList.length, 'sound', this.schedule.sound)
        if(!this.lastSchedule()){
            this.nextSchedule.schedule.reInitialize(this.schedule.getLatsBeat())
            this.nextSchedule.execute(audioNode)
        }
    }

    lastSchedule() {
        return this.nextSchedule===null
    }
}