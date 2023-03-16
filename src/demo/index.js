import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Demo from './Demo.vue'


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)


const vue = new Vue({
    render: h => h(Demo),
})


vue.$mount('#application')