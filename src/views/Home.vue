<template>
  <div class="home">

    <md-content class="metronome">

      <div v-bind:style="bgc" v-on:input="bgc.backgroundColor = $event.target.value">.</div>

      <div> {{ stressOneCounter }} | {{ timerValue }} | {{ stressTwoCounter }} </div>

      <md-button class="md-fab" @click="onOff">
          <md-icon v-if="stoped">▹</md-icon> <!--▸▹►-->
          <md-icon v-else style="color: red;"> ■ </md-icon>
      </md-button>

      <!--img alt="Vue logo" src="../assets/logo.png"-->
      <!--HelloWorld msg="Welcome to Your Vue.js App"/-->
      <knob-control 
        v-model="bpm"
        :size="220"
        :min="40"
        :max="300">
      </knob-control>

      <sound-selector 
        @soundSelect="setSound($event)"
        :showTag1=true
        :showTag2=true
        selector1="Beeper"
        selector2="Kicker"
      >
      </sound-selector>

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

    </md-content>
    
    <md-content class="tools">

      <md-content class="timeLimit">
        <time-selector @timeLimit="setTimeLimit($event)"></time-selector>
        <md-switch v-model="timeLimitEnable" class="md-primary"></md-switch>
        <div> Time Limit:
          <div v-if="timeLimitEnable">On</div>
          <div v-else>Off</div>
        </div>
      </md-content>

      <md-content class="stresser">
        <md-button class="md-icon-button md-dense md-raised md-primary" @click="addStressOne">
          <md-icon> + </md-icon>
        </md-button>
        <md-button class="md-icon-button md-dense md-raised" @click="subStressOne">
          <md-icon> - </md-icon>
        </md-button>
        {{ stressOne }}
        <br>
        <md-button class="md-icon-button md-dense md-raised md-primary" @click="addStressTwo">
          <md-icon> + </md-icon>
        </md-button>

        <md-button class="md-icon-button md-dense md-raised" @click="subStressTwo">
          <md-icon> - </md-icon>
        </md-button>
        {{ stressTwo }}
        <br>

        <md-switch v-model="stressOnly" class="md-primary"></md-switch>
        <div> Stress Only:
          <div v-if="stressOnly">On</div>
          <div v-else>Off</div>
        </div>

      </md-content>
    
    </md-content>

  </div>
</template>

<script>
// @ is an alias to /src
import SoundSelector from '@/components/SoundSelector.vue'
import TimeSelector from '@/components/TimeSelector.vue'
import VueKnobControl from 'vue-knob-control'
import RangeSlider from 'vue-range-slider'
// you probably need to import built-in style
import 'vue-range-slider/dist/vue-range-slider.css'
// import VueCircleSlider from 'vue-circle-slider'

export default {
  name: 'home',
  components: {
    'knob-control': VueKnobControl,
    'range-slider': RangeSlider,
    'sound-selector': SoundSelector,
    'time-selector': TimeSelector,
    // 'circle-slider': VueCircleSlider
  },
  data() {
    return {
      bpm: this.$store.state.bpm,
      volume: this.$store.state.volume,
      timeLimitEnable: this.$store.state.timeLimitEnable,
      timerValue: this.$store.state.timer.getTimeValues().toString(),
      // click: false,
      bgc: { backgroundColor: '' },
      stressOnly: false,
      stressOne: 0,
      stressTwo: 0,
      stoped: true,
      clock1: 0,
      clock2: 0,
      stressOneCounter: 0,
      stressTwoCounter: 0,
    }
  },
  watch: {
    clock1: function (value) {
      if (value<=this.stressOne){
        this.stressOneCounter = value
      } else if (this.stressOne!=0){
        this.stressOneCounter = 1
        this.clock1 = 1
      }
    },
    clock2: function (value) {
      if (value<=this.stressTwo){
        this.stressTwoCounter = value
      } else if (this.stressTwo!=0){
        this.stressTwoCounter = 1
        this.clock2 = 1
      }
    },
    bpm: function (value) { this.setBpm(value) },
    volume: function (value) { this.setGain(value) },
    timeLimitEnable: function (value) { this.setTimeLimitEnable(value) },
    stressOnly: function (value) {
      this.$store.commit('setStressOnly', value)
      // eslint-disable-next-line
      StateNodes.setStressOnly(this.$store.state.stressOnly)
    },
    stressOne: function (value) {
      // eslint-disable-next-line
      // stressOneInterval(value)
      this.$store.commit('setStressOne', value)
      // eslint-disable-next-line
      StateNodes.setStressOne(this.$store.state.stressOne)
    },
    stressTwo: function (value) {
      // eslint-disable-next-line
      // stressTwoInterval(value)
      this.$store.commit('setStressTwo', value)
      // eslint-disable-next-line
      StateNodes.setStressTwo(this.$store.state.stressTwo)
    }
  },
  methods: {
    addStressOne() {
      this.stressOne++
      if (!this.stoped) { this.fixWhenRunning() }
    },
    subStressOne() {
      this.stressOne>0? this.stressOne-- : this.stressOne = 0
      if (!this.stoped) { this.fixWhenRunning() }
    },
    addStressTwo() {
      this.stressTwo++
      if (!this.stoped) { this.fixWhenRunning() }
    },
    subStressTwo() {
      this.stressTwo>0? this.stressTwo-- : this.subStressTwo = 0
      if (!this.stoped) { this.fixWhenRunning() }
    },
    fixWhenRunning() {
      this.onOff()
      this.onOff()
    },
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
        this.stoped = false
        if (this.timeLimitEnable) {
          timer.start({countdown: true, startValues: {seconds: this.$store.state.timeLimit}});
          timer.addEventListener('targetAchieved', () => {
            this.timerValue = 'Well Done!'
            this.stoped = true
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
        this.stoped = true
        this.bgc.backgroundColor = '#FFFAFA'
      }
      this.resetClockAndCounters()
    },
    resetClockAndCounters() {
      this.clock1 = 0
      this.clock2 = 0
      this.stressOneCounter = 0
      this.stressTwoCounter = 0
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
      console.log(value)
      this.$store.commit('setSoundSelect', value)
      // eslint-disable-next-line
      StateNodes.setSound(getSounds().get(this.$store.state.soundSelect))
    },
    setGain (value) {
      this.$store.commit('setVolume', value)
      // eslint-disable-next-line
      StateNodes.setGain(this.$store.state.volume)
    },
    setTimeLimit (value) {
      this.$store.commit('setTimeLimit', value)
      // eslint-disable-next-line
      setTimeLimit(this.$store.state.timeLimit)
    },
    setTimeLimitEnable (value) {
      this.$store.commit('setTimeLimitEnable', value)
      // eslint-disable-next-line
      setTimeLimitEnable(this.$store.state.timeLimitEnable)
    },
    
  },
  computed: {
  },
  mounted() {
    window.addEventListener('keyup', (e) => {
      console.log(`keyup event. key property value is "${e.key}"`, e.keyCode, this.$route.name);
    });
    window.addEventListener('SoundExecute', () => { 
        this.bgc.backgroundColor = this.getRandomColor()
        this.clock1++
        this.clock2++
      }, false);
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

  .home {
    display: inline-flex
  }

  .metronome {
    width: 220px;
    height: 440px;
  }

  .tools {
    width: 220px;
    height: 440px;
    display: flex;
    flex-direction: column;
    justify-content: center; //space-evenly;
  }

  .timeLimit {
    width: 105px;
    height: 165px;
    margin: auto;
  }

  .stresser {
    width: 105px;
    height: 165px;
    margin: auto;
  }

</style>
