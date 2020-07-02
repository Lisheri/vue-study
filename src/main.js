import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Directives from '@/pages/directive/directives.js'
import Antdv from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false
Vue.use(Directives)
Vue.use(Antdv)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

// render()函数有三个参数,createElement是render函数的参数，约定h为createElement的简写
