import Vue from 'vue'
import Vuex from 'vuex'
// import { StateNodes } from '../public/audio-nodes';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stateNodes: null,
    bpm: 60,
    volume: 80,
    soundSelect: 'beeper'
  },
  mutations: {
    setBpm (state, value) { state.bpm = value },
    setVolume (state, value) { state.volume = value },
    setSoundSelect (state, value) { state.soundSelect = value },
  },
  actions: {

  },
  getters: {
    // getStateNodes: (state) => state.stateNodes
  }
})
