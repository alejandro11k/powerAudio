<template>
  <div class="schedule">
    <md-content class="main">
    
      <md-progress-bar class="md-accent" md-mode="determinate" :md-value="amountFwd"></md-progress-bar>
      <md-progress-bar md-mode="determinate" :md-value="amountFwd"></md-progress-bar>
    
      <div> {{ countUpInMinutes }} </div>

      <md-button class="md-fab" v-longpress="removeAll" @click="add">
          <md-icon> + </md-icon>
      </md-button>
      <md-button class="md-fab" @click="play"> <!--v-longpress="stop"-->
          <md-icon v-if="stoped">▹</md-icon>
          <md-icon v-else style="color: red;"> ■ </md-icon>  <!--▐ ▌-->
      </md-button>
      <time-selector @timeLimit="setTimeLimit($event)"></time-selector>
      <div>
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
      </div>
    </md-content>

    <md-content class="list">

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
        timeStamp: Date.now(),
        amountFwd: 0,
        clock: 0,
        countup: 0,
        stoped: true
        // bgc: { backgroundColor: '' },
    }
  },
  computed: {
    countUpInMinutes () {
      let actualLimit = this.countup
      let value = 0
      if (actualLimit < 60) {
        value = actualLimit + ' seg.'
      } else {
        let minutos = Math.floor(actualLimit / 60)
        let segundos = actualLimit - (minutos * 60)
        if (segundos==0) {
          segundos = ''
        } else if (segundos >= 1 && segundos <= 9) {
            segundos = ':0' + segundos
        } else {
            segundos = ':' + segundos
        }
        value = minutos + segundos + ' minute'
      }
      return value
    }
  },
  watch: {
    bpm: function (value) { this.updateBpm(value) },
    timeLimit: function (value) { this.updateTimeLimit(value) },
    clock: function () { 
      if (this.countup < this.totalTimeList()) { 
        this.countup++ 
      }
      this.setAmountFwd(this.countup)
      if (this.amountFwd===100) {
        this.stop()
      }
    },
    soundSelected: function (value) { this.updateSoundSelected(value) },
    scheduleTempList: function (value) { this.$store.commit('setScheduleTempList', value) } // this fire twice when add and element?
  },
  methods: {
    removeAll() {
      this.stop()
      this.timeStamp = Date.now()
      this.scheduleTempList = []
    },
    stop() {
      this.timeStamp = Date.now()
      // eslint-disable-next-line
      ScheduleModule.stop()
      this.stoped = true
      this.countup = 0
      this.amountFwd = 0
    },
    deleteChip(pos) {
      if (this.stoped) {
        const tempList = this.$store.getters.getScheduleTempList
        tempList.splice(pos,1)
        this.$store.commit('setScheduleTempList', tempList)
      }
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
      const actualTimeStamp = Date.now()
      const diffTime = actualTimeStamp-this.timeStamp < 500
      if (!diffTime && this.stoped) {
        //new schedule
        const bpm = this.$store.getters.getScheduleProperties.bpm
        const timeLimit = this.$store.getters.getScheduleProperties.timeLimit
        const soundSelected = this.$store.getters.getScheduleProperties.soundSelected
        const newSchedule = [bpm, timeLimit, soundSelected]
        //add schedule
        const tempList = this.$store.getters.getScheduleTempList
        tempList.push(newSchedule)
        this.$store.commit('setScheduleTempList', tempList)
        
        // eslint-disable-next-line
        // const test = new Schedule(newSchedule[0],newSchedule[1],newSchedule[2]) // real schedules
      }
    },
    play() {
      
      // code to use loongpress directive
      // const actualTimeStamp = Date.now()
      // const diffTime = actualTimeStamp-this.timeStamp < 500
      // if (!diffTime) {

      if (this.totalTimeList()>0) {
        if (this.stoped) {
        this.stoped = !this.stoped
        
        window.addEventListener('Clock', () => { 
          console.log('Clock')
          // this.bgc.backgroundColor = this.getRandomColor()
          this.clock++
        }, false);
        
        // eslint-disable-next-line
        let currentTime = ScheduleModule.suspendResume(this.cloneList())
        this.countup = Math.round(currentTime)
        } else {
          this.stop();
        }
      }
      
    },
    getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
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
    margin: 1px;
  }

  .schedule {
    display: inline-flex;
    // justify-content: center;
  }

  .main {
    width: 440px;
  }

  .list {
    width: 80px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

</style>