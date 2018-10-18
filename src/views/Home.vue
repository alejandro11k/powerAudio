<template>
  <div class="home">

    <md-button class="md-fab" @click="onOff">
        <md-icon> > </md-icon>
    </md-button>

    <!--img alt="Vue logo" src="../assets/logo.png"-->
    <!--HelloWorld msg="Welcome to Your Vue.js App"/-->
    <knob-control 
      v-model="bpm"
      :size="220"
      :min="40"
      :max="300">
    </knob-control>
    <md-radio v-model="soundSelect" value="beeper">Beeper</md-radio>
    <md-radio v-model="soundSelect" value="kicker">Kicker</md-radio>

    <div>
      <br>
      <input type="range" v-model.number="volume"> {{ volume }}%
    </div>

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
      bpm: this.$store.state.bpm,
      soundSelect: 'beeper',
      volume: 60
    }
  },
  watch: {
    bpm: function (value) { this.setBpm(value) },
    soundSelect: function (value) { this.setSound(value) },
    volume: function (value) { this.setGain(value) }
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
    setSound(value) {
      // eslint-disable-next-line
      StateNodes.setSound(getSounds().get(value))
    },
    setGain(value) {
      StateNodes.setGain(value)
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

  .viewport {
    width: 320px;
    max-width: 80%;
    display: inline-block;
    vertical-align: top;
    overflow: auto;
    border: 1px solid rgba(#000, .12);
  }
</style>
