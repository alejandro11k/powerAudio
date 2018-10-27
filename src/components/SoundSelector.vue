<template>
    <div>
        <md-radio v-model="soundSelect" value="beeper">Beeper</md-radio>
        <md-radio v-model="soundSelect" value="kicker">Kicker</md-radio>
    </div>
</template>

<script>
export default {
  name: 'SoundSelector',
  data() {
      return {
          soundSelect: 'beeper'
      }
  },
  watch: {
      soundSelect: function (value) { this.$emit('soundSelect', value) }
  }
}
</script>