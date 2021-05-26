import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import Element from  'element-ui'

// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'

import 'element-ui/lib/theme-chalk/index.css' //引入样式

import '../src/assets/fonts/iconfont.css' //阿里矢量图标库

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//引入axios
import axios from 'axios'


//axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'  //最新地址
 axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'  //其他人的地址

//axios 发送请求的配置加入header属性
axios.interceptors.request.use(config => {
  NProgress.start()

  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})


axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})


// 挂载在原型链之前
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 组件全局注册 表格树
Vue.component('tree-table', TreeTable)

Vue.use(Element)
Vue.use(VueQuillEditor)

Vue.filter("dataFormat",function(originVal){
   const dt= new Date(originVal)
   const y= dt.getFullYear()
   const m = (dt.getMonth() + 1 + '').padStart(2, '0')
   const d = (dt.getDate() + '').padStart(2, '0')
 
   const hh = (dt.getHours() + '').padStart(2, '0')
   const mm = (dt.getMinutes() + '').padStart(2, '0')
   const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
