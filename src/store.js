import Vue from 'vue'
import Vuex from 'vuex'
// import { StateNodes } from '../public/audio-nodes';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stateNodes: null,
    bpm: 60
  },
  mutations: {
    // setBpm: function (value) { this.state.bpm = value }
    setBpm (state, n) { state.bpm = n }
  },
  actions: {

  },
  getters: {
    // getStateNodes: (state) => state.stateNodes
  }
})
