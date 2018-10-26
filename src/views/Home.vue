<template>
  <div class="home">

    <div v-bind:style="bgc" v-on:input="bgc.backgroundColor = $event.target.value">.</div>
    
    <div> {{ timerValue }} </div>

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

    <sound-selector soundSelect="soundSelect"></sound-selector>

    <!--md-radio v-model="soundSelect" value="beeper">Beeper</md-radio>
    <md-radio v-model="soundSelect" value="kicker">Kicker</md-radio-->

    <br>
    <range-slider
      class="slider"
      min="0"
      max="100"
      step="1"
      v-model="volume">
    </range-slider>

    <div>
      Volume: {{ volume }}%
    </div>

    <div>
      <br>
      {{ timeLimitInMinutes() }}
      <br>
      <md-button class="md-fab md-mini md-primary" @click="add10">
        <md-icon> + </md-icon>
      </md-button>
      <md-button class="md-fab md-mini md-plain" @click="sub10">
        <md-icon> - </md-icon>
      </md-button>

      <md-switch v-model="timeLimitEnable" class="md-primary"></md-switch>
      <div> Time Limit:
      <div v-if="timeLimitEnable">On</div>
      <div v-else>Off</div>

      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import SoundSelector from '@/components/SoundSelector.vue'
import VueKnobControl from 'vue-knob-control'
import RangeSlider from 'vue-range-slider'
// you probably need to import built-in style
import 'vue-range-slider/dist/vue-range-slider.css'

export default {
  name: 'home',
  components: {
    // HelloWorld
    'knob-control': VueKnobControl,
    'range-slider': RangeSlider,
    'sound-selector': SoundSelector
  },
  data() {
    return {
      bpm: this.$store.state.bpm,
      // soundSelect: 'beeper',
      volume: this.$store.state.volume,
      timeLimit: this.$store.state.timeLimit,
      timeLimitEnable: this.$store.state.timeLimitEnable,
      timerValue: this.$store.state.timer.getTimeValues().toString(),
      click: false,
      bgc: { backgroundColor: '' }
    }
  },
  computed: {
    soundSelect: function (value) { 
        // this.setSound(value) 
        console.log(value)
        return 'kicker';
      }
  },
  watch: {
    bpm: function (value) { this.setBpm(value) },
    // soundSelect: function (value) { this.setSound(value) },
    volume: function (value) { this.setGain(value) },
    timeLimit: function (value) { this.setTimeLimit(value) },
    timeLimitEnable: function (value) { this.setTimeLimitEnable(value) },
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
      
      const timer = this.$store.state.timer
      if (!timer.isRunning()) {
        if (this.timeLimitEnable) {
          timer.start({countdown: true, startValues: {seconds: this.timeLimit}});
          timer.addEventListener('targetAchieved', () => {
            this.timerValue = 'Well Done!'
          });
        } else {
          timer.start();
        }
        this.timerValue = timer.getTimeValues().toString()
        timer.addEventListener('secondsUpdated', (e) => {
          this.timerValue = e.detail.timer.getTimeValues().toString()
        });
      } else {
        timer.stop();
      }
      
      window.addEventListener('SoundExecute', () => { 
        this.bgc.backgroundColor = this.getRandomColor()
      }, false);
      
    },
    getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    setSound (value) {
      this.$store.commit('setSoundSelect', value)
      // eslint-disable-next-line
      StateNodes.setSound(getSounds().get(this.$store.state.soundSelect))
    },
    setGain (value) {
      this.$store.commit('setVolume', value)
      // eslint-disable-next-line
      StateNodes.setGain(this.$store.state.volume)
    },
    add10 () {
      this.timeLimit = this.timeLimit + 10
    },
    sub10 () {
      this.timeLimit = this.timeLimit - 10
    },
    setTimeLimit (value) {
      this.$store.commit('setTimeLimit', value)
      console.log('after', this.$store.state.timeLimit)
      // eslint-disable-next-line
      setTimeLimit(this.$store.state.timeLimit)
    },
    setTimeLimitEnable (value) {
      this.$store.commit('setTimeLimitEnable', value)
      // eslint-disable-next-line
      setTimeLimitEnable(this.$store.state.timeLimitEnable)
    },
    timeLimitInMinutes () {
      let actualLimit = this.$store.state.timeLimit
      let value = 0
      if (actualLimit < 60) {
        value = actualLimit + ' seg.'
      } else {
        let minutos = Math.floor(actualLimit / 60)
        let segundos = actualLimit - (minutos * 60)
        if (segundos==0) {
          segundos = ''
        } else {
          segundos = ':' + segundos
        }
        value = minutos + segundos + ' minute'
      }
      return value
    }
  },
  computed: {

  },
  mounted() {
    window.addEventListener('keyup', (e) => {
      console.log(`keyup event. key property value is "${e.key}"`);
      // this.onOff()
    });
  },
  beforeUpdate() {
    
  },
  updated() {
    
  },
}
</script>

<style lang="scss" scoped>
@import "~vue-material/dist/theme/engine";

  .slider {
  /* overwrite slider styles */
  width: 200px;
  }

</style>
