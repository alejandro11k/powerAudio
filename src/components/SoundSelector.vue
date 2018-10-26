<template>
    <div>
        <md-radio v-model="soundSelect" value="beeper">Beeper</md-radio>
        <md-radio v-model="soundSelect" value="kicker">Kicker</md-radio>
    </div>
</template>

<script>
export default {
  name: 'SoundSelector',
  props: {
    soundSelect: {
        type: String,
        default: 'beeper'
    }
  },
}
</script>