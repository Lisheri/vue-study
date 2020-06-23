import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

// render()函数有三个参数,createElement是render函数的参数，约定h为createElement的简写
