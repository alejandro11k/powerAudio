import Vue from 'vue'
import Vuex from 'vuex'
// import { StateNodes } from '../public/audio-nodes';
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
    timer: timer,
    scheduleProperties: {
      bpm: 60,
      timeLimit: 10,
      soundSelected: 'beeper'
    },
    scheduleTempList: []

  },
  mutations: {
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
      //state.scheduleTempList.push(value)
      //console.log(state.scheduleTempList)
      state.scheduleTempList = value
    }
  },
  actions: {

  },
  getters: {
    // getStateNodes: (state) => state.stateNodes
    getScheduleProperties: (state) => { return state.scheduleProperties },
    getScheduleTempList: (state) => { return state.scheduleTempList }
  }
})
