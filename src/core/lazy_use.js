import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/defaultSettings'

// base library
import '@/core/lazy_lib/components_use'
import MultiTab from '@/components/MultiTab'
import './directives/action'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// ECharts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': false, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})
import VueLazyload from 'vue-lazyload'

//Vue.use(VueLazyload)

// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error:require("@/assets/loadfailed.jpg"),
  loading:require("@/assets/loading.gif"),
  attempt: 1
})


Vue.use(MultiTab)
Vue.use(VueStorage, config.storageOptions)
