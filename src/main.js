import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/global.css'

// 商品分类表格工具
import treeTable from 'vue-table-with-tree-grid'

// 全局配置axios 直接使用 this 可调用到
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器 通过axios拦截器添加token验证
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios

Vue.config.productionTip = false
Vue.component('tree-table', treeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
