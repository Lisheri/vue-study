import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Directives from '@/pages/directive/directives.js'
import Antdv from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import 'xe-utils'
import VXETablePluginVirtualTree from 'vxe-table-plugin-virtual-tree'
import 'vxe-table-plugin-virtual-tree/dist/style.css'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

Vue.config.productionTip = false
Vue.use(Directives)
Vue.use(Antdv)
Vue.use(VXETable)
VXETable.use(VXETablePluginVirtualTree)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

// render()函数有三个参数,createElement是render函数的参数，约定h为createElement的简写
