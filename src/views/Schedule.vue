<template>
  <div class="schedule">
    <md-content class="mainSection">

      <md-progress-bar md-mode="determinate" :md-value="amountBwd"></md-progress-bar>
      <md-progress-bar class="md-accent" md-mode="determinate" :md-value="amountFwd"></md-progress-bar>
    
      <div> {{ timerValue }} </div>
      <div> {{ anotherTimerValue }} </div>

      <md-button class="md-fab" @click="add">
          <md-icon> + </md-icon>
      </md-button>
      <md-button class="md-fab" v-longpress="test" @click="play">
          <md-icon> > </md-icon>
      </md-button>
      <time-selector @timeLimit="setTimeLimit($event)"></time-selector>
      <div>
        <knob-control 
          v-model="bpm"
          :size="220"
          :min="40"
          :max="300">
        </knob-control>
        <sound-selector @soundSelect="setSound($event)"></sound-selector>
      </div>
    </md-content>

    <br>
    <!--md-button @click="test">
      <md-icon> test </md-icon>
    </md-button>
    <br-->
    
    
    <md-content class="listSection">

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
        scheduleProperties: this.$store.state.scheduleProperties,
        scheduleTempList: this.$store.state.scheduleTempList,
        amountFwd: 0,
        amountBwd: 100,
        timerValue: this.$store.state.timer.getTimeValues().toString(),
        anotherTimerValue: this.$store.state.anotherTimer.getTimeValues().toString(),
    }
  },
  watch: {
    bpm: function (value) { this.updateBpm(value) },
    timeLimit: function (value) { this.updateTimeLimit(value) },
    soundSelected: function (value) { this.updateSoundSelected(value) },
    // timerValue: function (value) { this,setAmount() },
    scheduleTempList: function (value) { this.$store.commit('setScheduleTempList', value) } // this fire twice when add and element?
  },
  methods: {
    test() {
      // eslint-disable-next-line
      // ScheduleModule.test()
      // console.log('teeeeeessst!')
      // eslint-disable-next-line
      // console.log(ScheduleModule.test())
      this.totalTimeList()
    },
    deleteChip(pos) {
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

      // real schedules
      // eslint-disable-next-line
      const test = new Schedule(newSchedule[0],newSchedule[1],newSchedule[2])
      console.log(test)
    },
    play() {
      
      const timer = this.$store.state.timer
      const anotherTimer = this.$store.state.anotherTimer

      if (!timer.isRunning()) {
        // if (this.timeLimitEnable) {
          anotherTimer.start();
          timer.start({countdown: true, startValues: {seconds: this.totalTimeList()}});
          timer.addEventListener('targetAchieved', () => {
            this.timerValue = 'Well Done!'
            anotherTimer.stop()
          });
        
        this.timerValue = timer.getTimeValues().toString()
        timer.addEventListener('secondsUpdated', (e) => {
          this.timerValue = e.detail.timer.getTimeValues().toString()
          this.setAmountBwd(e.detail.timer.getTimeValues().seconds)
        });

        anotherTimer.addEventListener('secondsUpdated', (e) => {
          this.anotherTimerValue = e.detail.timer.getTimeValues().toString()
          this.setAmountFwd(e.detail.timer.getTimeValues().seconds)
        });

      } else {
        timer.stop();
        anotherTimer.stop();
      }

      // eslint-disable-next-line
      ScheduleModule.suspendResume(this.cloneList())

    },
    setAmountBwd(remaining) {
      const totalSec = this.totalTimeList()
      this.amountBwd = (remaining * 100) / totalSec
    },
    setAmountFwd(time) {
      const totalSec = this.totalTimeList()
      this.amountFwd = (time * 100) / totalSec
    },
    cloneList() {
      const original = this.$store.getters.getScheduleTempList // return observer?!?!?!?!)
      let cloned = JSON.parse(JSON.stringify(original)); // this will copy everything from original 
      return cloned;
    },
    totalTimeList() {
      let totalSeconds = 0
      this.cloneList().forEach(element => {
        totalSeconds = totalSeconds + element[1]
      });
      return totalSeconds
    }
  },
  directives: {
        longpress: {
            // https://blog.logrocket.com/building-a-long-press-directive-in-vue-3408d60fb511
            bind: function (el, binding, vNode) {
            // Make sure expression provided is a function
                if (typeof binding.value !== 'function') {
                    // Fetch name of component
                    const compName = vNode.context.name
                    // pass warning to console
                    let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be`
                    if (compName) { warn += `Found in component '${compName}' ` }

                    console.warn(warn)
                }

                // Define variable
                let pressTimer = null

                // Define funtion handlers
                // Create timeout ( run function after 1s )
                let start = (e) => {

                    if (e.type === 'click' && e.button !== 0) {
                        return;
                    }

                    if (pressTimer === null) {
                        pressTimer = setTimeout(() => {
                            // Run function
                            handler()
                        }, 1000)
                    }
                }

                // Cancel Timeout
                let cancel = () => {
                    // Check if timer has a value or not
                    if (pressTimer !== null) {
                        clearTimeout(pressTimer)
                        pressTimer = null
                    }
                }
                // Run Function
                const handler = (e) => {
                    binding.value(e)
                }

                // Add Event listeners
                el.addEventListener("mousedown", start);
                el.addEventListener("touchstart", start);
                // Cancel timeouts if this events happen
                el.addEventListener("click", cancel);
                el.addEventListener("mouseout", cancel);
                el.addEventListener("touchend", cancel);
                el.addEventListener("touchcancel", cancel);
            }
        }
    }
}
</script>

<style lang="scss" scoped>

  .md-progress-bar {
    margin: 10px;
  }

  .schedule {
    display: inline-flex
  }

  .md-content {
    &.mainSection {
      width: 400px;
    }
    &.listSection {
      width: 80px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>