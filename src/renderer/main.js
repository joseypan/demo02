import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入主题
/** ------------------------------
                主题
 -------------------------------- */
import { theme, themeSetup } from './assets/css/theme/index.js'
Vue.use(ElementUI)
Vue.themeSetup = Vue.prototype.$themeSetup = themeSetup
Vue.theme = Vue.prototype.$theme = theme

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
// // 设置axios拦截器
axios.interceptors.request.use(
  function (config) {
    config.headers.token = '96d8a4e4-42d8-4620-903b-fb72ce1bc2b8'
    return config
  },
  function (error) {
    console.log(error)
  }
)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
