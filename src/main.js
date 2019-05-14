// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '../static/flexible.js'
import '../static/flexible_css.js'

Vue.use(MintUI)
Vue.config.productionTip = false
Vue.prototype.locationHref = '/detail'
// Vue.prototype.locationHref = '/'
// Vue.prototype.PdfHref = 'http://192.168.32.223:8080'
// Vue.prototype.PdfHref = '/api'
Vue.prototype.PdfHref = '/'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})