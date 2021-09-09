/*
 * @Author: your name
 * @Date: 2020-08-06 09:58:34
 * @LastEditTime: 2021-03-05 18:03:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2\src\main.js
 */
import Vue from 'vue';
import App from './App.vue';
// import router from './router';
import router from './router/router'
import ElementUI from 'element-ui';

import './permission' // 权限

import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

import VCharts from 'v-charts'
Vue.use(VCharts)

import R from './api/request.js';
Vue.prototype.$R = R;

// SplitPane Vue拖拽插件
import splitPane from 'vue-splitpane'
Vue.component('split-pane', splitPane);
import VueBus from 'vue-bus';
Vue.use(VueBus);
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅主题
import './assets/css/theme-dark/fonts/icon.css'
import './assets/css/theme-dark/fonts/iconfont.css'
import './assets/css/theme-dark/color-dark.css'
import './assets/scss/base.scss'
import './assets/scss/layout.scss'
import '@/assets/etl/base.scss'
import './assets/scss/elementg.scss'
import './assets/scss/element-ui.scss'
import './assets/scss/tags.scss'
import 'babel-polyfill';

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(VXETable)
// 消息
import { msgSuccess, msgWarning, msgError, msgBox } from './method/msg.js'
Vue.prototype.msgSuccess = msgSuccess
Vue.prototype.msgWarning = msgWarning
Vue.prototype.msgError = msgError
Vue.prototype.msgBox = msgBox

// 粒子特效
import VueParticles from 'vue-particles';
Vue.use(VueParticles)

// 引用代码编辑插件
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodemirror)

Vue.config.productionTip = false;

Vue.use(ElementUI, {
    size: 'small'
});

import store from './store'

// 批量处理时间
import moment from 'moment/moment'
Vue.filter('moment', function (value, formatString) { formatString = formatString || 'YYYY-MM-DD HH:mm:ss'; return moment(value).format(formatString); });

// viewer图片预览插件
Vue.use(Viewer);
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | admin`;
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//             }
//         }
//     });

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
