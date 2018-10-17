import Vue from 'vue'
import Vuex from 'vuex'
// import { StateNodes } from '../public/audio-nodes';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stateNodes: null
  },
  mutations: {
    // setStateNodes: (state, obj) => state.stateNodes = obj
  },
  actions: {

  },
  getters: {
    // getStateNodes: (state) => state.stateNodes
  }
})
