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
        bpm: 60,
        timeLimit: 10,
        soundSelected: 'beeper',
        list: []
    }
  },
  methods: {
      setSound(value) {
          this.soundSelected = value
      },
      setTimeLimit(value) {
          this.timeLimit = value
      },
      add() {
        this.list.push('bpm - ' + this.bpm + 'timeLimit' + this.timeLimit + 'sound' + this.soundSelected)
        // eslint-disable-next-line
        ScheduleModule.add(this.bpm, this.timeLimit, this.soundSelected)
      },
      play() {
          // eslint-disable-next-line
          ScheduleModule.play()
      /*
          window.addEventListener('SoundExecute', (e) => { 
            console.log(e)
      }, false);
      */
      }
  }
}
</script>