<template>
    <div class="doc">
        <div class="title"> </div>
        <br>
        <!-- button @click="open()"> one kick </button-->
        <!-- button @click="times()"> times </button-->
        <!-- button @click="kicktimes()"> kick times </button-->
        <button @click="onOff()"> on/Off </button>
        <br>
        <br>
        <md-switch v-model="boolean">kiCk/bEEp</md-switch>
        <br>
        <md-radio v-model="radio" value="slow">Slow</md-radio>
        <br>
        <md-radio v-model="radio" value="medium">Medium</md-radio>
        <br>
        <md-radio v-model="radio" value="fast">Fast</md-radio>
    </div>
</template>

<script>
    import Demo1 from '../modules/demo1'
    import Data from '../modules/data'
    import Timer from 'easytimer.js'

    export default {
      data () {
        let intervalo = 6
        let modo = 'kick1'
        // let modo = 'beep1'
        let on = false
        let first = true
        let timer = new Timer()
        let count = 0
        let boolean = false
        let data = new Data()
        let radio = 'medium'
        timer.addEventListener('secondTenthsUpdated', function (e) {
          console.log(timer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']))
          // console.log(timer.getTimeValues())
          count++
          if (count === 1) {
            Demo1.destroy()
            Demo1.create(data.getMode())
          }
          if (count === data.getIntervalo()) {
            count = 0
          }
        })
        return {
          on: on,
          first: first,
          timer: timer,
          count: count,
          modo: modo,
          intervalo: intervalo,
          boolean: boolean,
          data: data,
          radio: radio
        }
      },
      methods: {
        open () {
          if (this.first) {
            this.first = false
            Demo1.getOscillator().start()
            Demo1.getOscillator().type = 'sine'
            Demo1.getOscillator().frequency.value = 220
            Demo1.trigger()
          } else {
            Demo1.trigger()
          }
        },
        times () {
          Demo1.times(10, 1)
        },
        kicktimes () {
          Demo1.kicktimes(10, 0.01)
        },
        onOff () {
          if (!this.boolean) {
            this.data.setMode('kick1')
          } else {
            this.data.setMode('beep1')
          }
          this.data.setIntervalo(this.radio)
          // if on false on true and start punch
          // if on true stop and on false
          // timer.start({precision: 'secondTenths'})
          if (this.on) {
            this.timer.stop()
            this.on = false
          } else {
            this.timer.start({precision: 'secondTenths'})
            this.on = true
          }
        }
      }
    }
</script>

<style>

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .general {
    display: flex;
    flex-direction: row;
  }

  .doc {
    color: black;
    margin-bottom: 20px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>