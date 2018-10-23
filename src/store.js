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
    timeLimit: 0,
    timeLimitEnable: false,
    timer: timer
  },
  mutations: {
    setBpm (state, value) { state.bpm = value },
    setVolume (state, value) { state.volume = value },
    setSoundSelect (state, value) { state.soundSelect = value },
    setTimeLimit (state, value) { state.timeLimit = value },
    setTimeLimitEnable (state, value) { state.timeLimitEnable = value },
  },
  actions: {

  },
  getters: {
    // getStateNodes: (state) => state.stateNodes
  }
})
