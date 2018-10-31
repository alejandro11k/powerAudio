<template>
  <div class="schedule">
    <div>
      <knob-control 
        v-model="bpm"
        :size="220"
        :min="40"
        :max="300">
      </knob-control>
      <sound-selector @soundSelect="setSound($event)"></sound-selector>
      <time-selector @timeLimit="setTimeLimit($event)"></time-selector>
    </div>
    <md-button class="md-fab" @click="add">
        <md-icon> + </md-icon>
    </md-button>
    <md-button class="md-fab" @click="play">
        <md-icon> > </md-icon>
    </md-button>
    <br>
    {{ list }}
    <br>
    <md-button @click="playTest">
        <md-icon> playTest </md-icon>
    </md-button>
  </div>
</template>

<script>
import SoundSelector from '@/components/SoundSelector.vue'
import TimeSelector from '@/components/TimeSelector.vue'
import VueKnobControl from 'vue-knob-control'
import RangeSlider from 'vue-range-slider'
// you probably need to import built-in style
import 'vue-range-slider/dist/vue-range-slider.css'

export default {
  name: 'schedule',
  components: {
    'knob-control': VueKnobControl,
    'range-slider': RangeSlider,
    'sound-selector': SoundSelector,
    'time-selector': TimeSelector
  },
  data() {
    return {
        bpm: this.$store.state.scheduleProperties.bpm,
        timeLimit: this.$store.state.scheduleProperties.timeLimit,
        soundSelected: this.$store.state.scheduleProperties.soundSelected,
        list: [],
        scheduleList: null,
        schedule: null,
        scheduleProperties: this.$store.state.scheduleProperties,
        scheduleTempList: this.$store.state.scheduleTempList
    }
  },
  watch: {
    bpm: function (value) { this.updateBpm(value) },
    timeLimit: function (value) { this.updateTimeLimit(value) },
    soundSelected: function (value) { this.updateSoundSelected(value) }
  },
  methods: {
      updateBpm(value) {
        this.$store.commit('setScheduleBpm', value)
      },
      updateTimeLimit(value) {
        this.$store.commit('setScheduleTimeLimit', value)
      },
      updateSoundSelected(value) {
        this.$store.commit('setScheduleSoundSelected', value)
      },
      updateScheduleProperties(value) {
        this.$store.commit('setScheduleProperties', value)
      },
      playTest(){
        const arraySchedules = [
          [60,5,'beeper'],
          [60,5,'kicker'],
          [60,5,'beeper']
        ]
        // eslint-disable-next-line
        ScheduleModule.playTest(arraySchedules)
      },
      setSound(value) {
          this.soundSelected = value
      },
      setTimeLimit(value) {
          this.timeLimit = value
      },
      add() {
        this.list.push('bpm: ' + this.bpm + '|timeLimit: ' + this.timeLimit + '|sound: ' + this.soundSelected)
        // eslint-disable-next-line
        // ScheduleModule.add(this.bpm, this.timeLimit, this.soundSelected)
        console.log(this.$store.getters.getScheduleProperties) // return observer?!?!?!?!
        const bpm = this.$store.getters.getScheduleProperties.bpm
        const timeLimit = this.$store.getters.getScheduleProperties.timeLimit
        const soundSelected = this.$store.getters.getScheduleProperties.soundSelected
        const value = [bpm, timeLimit, soundSelected]
        console.log('value', value)
        this.$store.commit('setScheduleTempList', value)
        console.log('scheduleTempList', this.$store.getters.getScheduleTempList) // return observer?!?!?!?!)
      },
      play() {
          // eslint-disable-next-line
          // ScheduleModule.play()
          console.log('scheduleTempList', this.$store.getters.getScheduleTempList) // return observer?!?!?!?!)
          // eslint-disable-next-line
          ScheduleModule.playTest(this.scheduleTempList)
          
      /*
          window.addEventListener('SoundExecute', (e) => { 
            console.log(e)
      }, false);
      */
      }
  }
}
</script>