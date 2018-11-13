import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueKnobControl from 'vue-knob-control'
// Vue.use(VueKnobControl)

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
// import 'vue-material/dist/theme/default.css'
import 'vue-material/dist/theme/black-green-light.css' // This line here
import VueCircleSlider from 'vue-circle-slider'

Vue.use(VueMaterial)
Vue.use(VueCircleSlider)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
