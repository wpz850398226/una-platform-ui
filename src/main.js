/*
 * @Author: Cui
 * @Date: 2020-06-23 21:15:05
 * @LastEditTime: 2020-09-28 09:15:26
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/main.js
 */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import echarts from 'echarts'
import CMessage from '@/utils/el-message'
import '@/styles/index.scss' // global css
// 字体图标
// import 'font-awesome/css/font-awesome.min.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
Vue.component('v-icon', Icon)

import UnaTable from './views/Base/components/UnaTable.vue'
Vue.component('una-table', UnaTable)

import UnaForm from './views/Base/components/UnaForm.vue'
Vue.component('una-form', UnaForm)

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
ElementUI.Dialog.props.closeOnClickModal.default = false
Vue.use(ElementUI)

Vue.prototype.$message = CMessage

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
