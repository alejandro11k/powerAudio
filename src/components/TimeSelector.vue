<template>
    <div>
        <br>
      {{ timeLimitInMinutes }}
      <br>
      <md-button class="md-fab md-mini md-primary" @click="add10">
        <md-icon> + </md-icon>
      </md-button>
      <md-button class="md-fab md-mini md-plain" @click="sub10">
        <md-icon> - </md-icon>
      </md-button>    
    </div>
</template>

<script>

export default {
  name: 'TimeSelector',
  data() {
      return {
          timeLimit: 10
      }
  },
  watch: {
      timeLimit: function (value) { this.$emit('timeLimit', value) }
  },
  methods: {
    add10 () {
      this.timeLimit = this.timeLimit + 10
    },
    sub10 () {
      this.timeLimit = this.timeLimit - 10
    },
  },
  computed: {
      timeLimitInMinutes () {
      let actualLimit = this.timeLimit
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
  }
}

</script>