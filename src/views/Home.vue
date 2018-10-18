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
    <md-radio v-model="soundSelect" value="beeper">Beeper</md-radio>
    <md-radio v-model="soundSelect" value="kicker">Kicker</md-radio>
    <vue-slide-bar v-model="simpleValue"/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import VueKnobControl from 'vue-knob-control'
import VueSlideBar from 'vue-slide-bar'

export default {
  name: 'home',
  components: {
    // HelloWorld
    'knob-control': VueKnobControl,
    'vue-slide-bar': VueSlideBar
  },
  data() {
    return {
      bpm: this.$store.state.bpm,
      soundSelect: 'beeper',
      simpleValue: 80
    }
  },
  watch: {
    bpm: function (value) { this.setBpm(value) },
    soundSelect: function (value) { console.log(value) },
    
  },
  methods: {
    setBpm (value) {
      this.$store.commit('setBpm', value)
      // eslint-disable-next-line
      StateNodes.setBpm(this.$store.state.bpm)
    },
    onOff () {
      // eslint-disable-next-line
      StateNodes.onOff()
    },
    consoleLog () {
      console.log(this.$store.state.bpm)
    }
  },
  computed: {

  },
  mounted() {

  },
  beforeUpdate() {
    
  },
  updated() {
    
  },
}
</script>

<style lang="scss" scoped>
  .md-content {
    width: 400px;
    height: 400px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
</style>
