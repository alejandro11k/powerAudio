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
    <!--br>
    {{ list }}
    <br-->

    <br>
    <br>

    <md-content>

      <div class="root">
        <slick-list 
          lockAxis="y" 
          v-model="scheduleTempList" >
          <slick-item v-for="(item, index) in scheduleTempList" :index="index" :key="index">
            <md-chip class="md-primary" md-deletable @md-delete="deleteChip(index)">
              {{ item }}
            </md-chip>
          </slick-item>
        </slick-list>
      </div>
    </md-content>

    <!--md-button @click="playTest">
        <md-icon> playTest </md-icon>
    </md-button-->
  </div>
</template>

<script>
import SoundSelector from '@/components/SoundSelector.vue'
import TimeSelector from '@/components/TimeSelector.vue'
import VueKnobControl from 'vue-knob-control'
import RangeSlider from 'vue-range-slider'
// you probably need to import built-in style
import 'vue-range-slider/dist/vue-range-slider.css'
import { SlickList, SlickItem } from 'vue-slicksort';

export default {
  name: 'schedule',
  components: {
    'knob-control': VueKnobControl,
    'range-slider': RangeSlider,
    'sound-selector': SoundSelector,
    'time-selector': TimeSelector,
    'slick-item': SlickItem,
    'slick-list': SlickList,
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
        scheduleTempList: this.$store.state.scheduleTempList,
        items: [],
        value: 0
    }
  },
  watch: {
    bpm: function (value) { this.updateBpm(value) },
    timeLimit: function (value) { this.updateTimeLimit(value) },
    soundSelected: function (value) { this.updateSoundSelected(value) },
    // this fire twice when add and element?
    scheduleTempList: function (value) { this.$store.commit('setScheduleTempList', value) }
  },
  methods: {
    deleteChip(pos) {
      // this.items.splice(pos,1)
      const tempList = this.$store.getters.getScheduleTempList
      tempList.splice(pos,1)
      this.$store.commit('setScheduleTempList', tempList)
    },
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
        //new schedule
        const bpm = this.$store.getters.getScheduleProperties.bpm
        const timeLimit = this.$store.getters.getScheduleProperties.timeLimit
        const soundSelected = this.$store.getters.getScheduleProperties.soundSelected
        const newSchedule = [bpm, timeLimit, soundSelected]
        //add schedule
        const tempList = this.$store.getters.getScheduleTempList
        tempList.push(newSchedule)
        this.$store.commit('setScheduleTempList', tempList)
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

<style lang="scss" scoped>
  .md-content {
    width: 80px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
</style>