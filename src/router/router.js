/*
 * @Author: your name
 * @Date: 2020-11-02 09:36:59
 * @LastEditTime: 2021-04-06 10:12:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clin-ui\src\router\router.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import PageRouter from './page/'
import AvueRouter from './avue-router'
import Store from '../store/'
Vue.use(VueRouter)
let Router = new VueRouter({
    // mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop
            }
            return {
                x: 0,
                y: to.meta.savedPosition || 0
            }
        }
    },
    routes: [].concat([])
})
AvueRouter.install(Router, Store)
Router.$avueRouter.formatRoutes(Store.state.user.menu, true)
// Router.addRoutes([...PageRouter])
PageRouter.forEach(element => {
    Router.addRoute(element)
});

export default Router
