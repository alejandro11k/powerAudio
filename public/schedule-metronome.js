import { Sound, Beeper, Kicker } from "./sound.js"

export class ScheduleModule {
    constructor() {
        this.context = null
        this.gainNode = null
        this.sounds = new Map()
        this.scheduleNode = null
        this.played = false
    }

    isFinished() {
        return (this.scheduleNode.getLastBeat()<this.context.currentTime)
    }

    suspendResume(schedules) {
        if(this.context !== null && this.context.state === 'running' && !this.isFinished()) {
            this.context.suspend().then(function() {
                return 'Suspending context';
          });
        } else if(this.context !== null && this.context.state === 'suspended') {
            this.context.resume().then(function() {
                return 'Resuming context';
          });  
        } else if (schedules.length > 0) {
            this.playScheduleNodes(schedules)
        }
    }

    playScheduleNodes(schedules) {
        this.createContextAndGainNode()
        this.initSounds()
        const firstSchedule = schedules[0]
        this.scheduleNode = new ScheduleNode(
            new Schedule(
                firstSchedule[0],
                firstSchedule[1],
                this.sounds.get(firstSchedule[2])
            ))
        schedules.splice(0,1)
        schedules.forEach((schedule)=>{
            this.scheduleNode.addNext(new Schedule(schedule[0],schedule[1],this.sounds.get(schedule[2])))
        })
        this.play()
    }

    play() {
        if (!this.played) {
            this.played = true
            this.context.audioWorklet.addModule('./processor.js').then(() => {
                this.scheduleNode.execute(this.context)
            })
        } else {
            this.scheduleNode.execute(this.context)
        }
        
    }

    initSounds() {
        const beeper = new Beeper(new Sound(this.context))
        const kicker = new Kicker(new Sound(this.context))
        this.sounds.set('beeper', beeper)
        this.sounds.set('kicker', kicker)
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

    getLastBeat() {
        return this.lastBeat
    }

    execute(audioNode) {
        this.timeList.forEach(time => {
            this.sound.executeAt(time,audioNode)
        });
    }

    // To use with Schedules without Sound Library
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


export class ScheduleNode {
    constructor(schedule) {
        this.schedule = schedule
        this.nextScheduleNode = null
    }

    getLastSchedule() {
        return this.lastScheduleNode() ? this.schedule : this.nextScheduleNode.schedule
    }

    getLastBeat() {
        return this.getLastSchedule().getLastBeat()
    }

    addNext(schedule) {
        if(this.lastScheduleNode()){
          this.nextScheduleNode = new ScheduleNode(schedule)
        } else {
            this.nextScheduleNode.addNext(schedule)
        }
    }

    execute(audioNode) {
        this.schedule.execute(audioNode)
        console.log('beats to play', this.schedule.timeList.length, 'sound', this.schedule.sound)
        if(!this.lastScheduleNode()){
            this.nextScheduleNode.schedule.reInitialize(this.schedule.getLastBeat())
            this.nextScheduleNode.execute(audioNode)
        }
    }

    lastScheduleNode() {
        return this.nextScheduleNode===null
    }
}