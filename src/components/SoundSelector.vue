<template>
    <div>
        <md-radio v-model="soundSelect" value="beeper">
            <div v-if="showTag1">{{selector1}}</div>
            <div v-else></div>
        </md-radio>
        <md-radio v-model="soundSelect" value="kicker">
            <div v-if="showTag2">{{selector2}}</div>
            <div v-else></div>
        </md-radio>
    </div>
</template>

<script>
export default {
  name: 'SoundSelector',
  props: { 
      selector1: String,
      selector2: String, 
      showTag1: Boolean, 
      showTag2: Boolean
    },
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