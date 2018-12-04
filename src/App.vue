<template>
  <div id="app">
    <div id="nav"> |
      <router-link v-if="scheduleStoped" to="/">Home</router-link>
      <router-link event="" v-else to="/">Home</router-link> |
      <router-link v-if="metronomeStoped" to="/schedule">Schedule</router-link>
      <router-link event="" style="color:#2c3e50;" v-else to="/">Schedule</router-link> |
      <div v-if="!detectAudioWorklet" style="color:red;"> You won't hear anything, get <a target="_blank" style="color:red;" href="https://www.google.com/chrome/">Chrome Browser</a></div>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name:'app',
  computed: {
    detectAudioWorklet() {
      let context = new OfflineAudioContext(1, 1, 44100);
        return Boolean(
          context.audioWorklet &&
          typeof context.audioWorklet.addModule === 'function');
    },
    metronomeStoped() {
      return this.$store.state.metronomeStoped
    },
    scheduleStoped() {
      return this.$store.state.scheduleStoped
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
