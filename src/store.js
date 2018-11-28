import Vue from 'vue'
import Vuex from 'vuex'
import Timer from 'easytimer.js/dist/easytimer.min.js'
const timer = new Timer()

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stateNodes: null,
    bpm: 60,
    volume: 80,
    soundSelect: 'beeper',
    timeLimit: 10,
    timeLimitEnable: false,
    stressOnly: false,
    timer: timer,
    stressOne: 0,
    stressTwo: 0,
    
    scheduleProperties: {
      bpm: 60,
      timeLimit: 10,
      soundSelected: 'beeper'
    },
    scheduleTempList: [],
    
    clock: 0,
    countDown: 0,
    clock1: 0,
    clock2: 0,
    stressOneCounter: 0,
    stressTwoCounter: 0,
    
  },
  mutations: {
    setStressOne (state, value) { state.stressOne = value },
    setStressTwo (state, value) { state.stressTwo = value },
    setStressOnly (state, value) { state.stressOnly = value },
    setClock (state, value) { state.clock = value },
    setCountDown (state, value) { state.countDown = value },
    setClock1 (state, value) { state.clock1 = value },
    setClock2 (state, value) { state.clock2 = value },
    setStressOneCounter (state, value) { state.stressOneCounter = value },
    setStressTwoCounter (state, value) { state.stressTwoCounter = value },


    setBpm (state, value) { state.bpm = value },
    setVolume (state, value) { state.volume = value },
    setSoundSelect (state, value) { state.soundSelect = value },
    setTimeLimit (state, value) { state.timeLimit = value },
    setTimeLimitEnable (state, value) { state.timeLimitEnable = value },
    setTimer (state, value) { state.timer = value },
    setScheduleProperties (state, value) { state.scheduleProperties = value },
    setScheduleBpm (state, value) { state.scheduleProperties.bpm = value },
    setScheduleTimeLimit (state, value) { state.scheduleProperties.timeLimit = value },
    setScheduleSoundSelected (state, value) { state.scheduleProperties.soundSelected = value },
    setScheduleTempList (state, value) { 
      state.scheduleTempList = value
    },
  },
  actions: {

  },
  getters: {
    getScheduleProperties: (state) => { return state.scheduleProperties },
    getScheduleTempList: (state) => { return state.scheduleTempList }
  }
})
