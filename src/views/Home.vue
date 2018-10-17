<template>
  <div class="home">
    <button @click="onOff">onOff</button>
    <!--img alt="Vue logo" src="../assets/logo.png"-->
    <!--HelloWorld msg="Welcome to Your Vue.js App"/-->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    // HelloWorld
  },
  data() {
    return {
      StateNodes: window.StateNodes
    }
  },
  mounted() {

  },
  beforeUpdate() {
    // this.$store.state.commit("setStateNodes", "window")
    
  },
  updated() {
    
  },
  methods: {
    onOff () {
      //console.log(this.$store.state, this.$store.getters)
      StateNodes.onOff()
    },
  }
}
</script>
