<template>
  <div class="home">
    <!--button @click="onOff">onOff</button-->
    <md-button class="md-fab" @click="onOff">
        <md-icon>></md-icon>
    </md-button>
    <!--img alt="Vue logo" src="../assets/logo.png"-->
    <!--HelloWorld msg="Welcome to Your Vue.js App"/-->
    <knob-control 
      v-model="bpm"
      :min="40"
      :max="300">
    </knob-control>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import VueKnobControl from 'vue-knob-control'

export default {
  name: 'home',
  components: {
    // HelloWorld
    'knob-control': VueKnobControl,
  },
  data() {
    return {
      // StateNodes: window.StateNodes
      bpm: this.$store.state.bpm
    }
  },
  watch: {
    bpm: function (value) { this.setBpm(value) }
  },
  computed: {

  },
  mounted() {

  },
  beforeUpdate() {
    // this.$store.state.commit("setStateNodes", "window")
    
  },
  updated() {
    
  },
  methods: {
    setBpm (value) {
      this.$store.commit('setBpm', value)
      StateNodes.setBpm(this.$store.state.bpm)
    },
    onOff () {
      //console.log(this.$store.state, this.$store.getters)
      
      // eslint-disable-next-line
      StateNodes.onOff()
    },
    consoleLog () {
      console.log(this.$store.state.bpm)
    }
  }
}
</script>
