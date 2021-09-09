/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from '@/store'
import {validatenull} from '@/util/validate'
import { loginByUsernameBase, getSSo } from '@/api/login'
import { Message } from 'element-ui';
var ssoPost = 0 // 避免死循环重复登录
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// NProgress.configure({showSpinner: false})
// import { showLoading, hideLoading } from './page/js/loading';

/**
 * 导航守卫，相关内容可以参考:
 * https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
 */
router.beforeEach((to, from, next) => {
  // 缓冲设置
  if (to.meta.keepAlive === true && store.state.tags.tagList.some(ele => {
    // return ele.value === to.fullPath
    return ele.value === to.path
  })) {
    to.meta.$keepAlive = true
  } else {
    // showLoading();
    if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
      to.meta.$keepAlive = true
    } else {
      to.meta.$keepAlive = false
    }
  }
  const meta = to.meta || {}
  if (store.getters.access_token) {
   if (to.path === '/login') {
      next({path: '/'})
    } else {
      // NOTE: 当用户角色不存在时，会存在无限请求用户信息接口的问题
      if (store.getters.roles.length === 0) {
        store.dispatch('GetUserInfo').then(() => {
          next()
        }).catch((e) => {
          console.log(e)
          store.dispatch('FedLogOut').then(() => {
            next({path: '/login'})
            // hideLoading();
          })
        })
      }
    //   else {
        const value = to.query.src || to.fullPath
        let label = to.query.name || to.name
        const path = to.path
        if (label === 'xxx') {
           window.open(value)
        } else {
            //更新tag名称
            if (store.state.user.menu && to.redirectedFrom) {
              let menu = store.state.user.menu.find(item => item.path == to.redirectedFrom)
              if (menu) {
                label = menu.label
              }
            }
            if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
                store.commit('ADD_TAG', {
                  label: label,
                  value: value,
                  path: path,
                  params: to.params,
                  query: to.query,
                  group: router.$avueRouter.group || []
                })
            }
            next()
        }
    //   }
    }
  } else {
    // if (meta.isAuth === false) {
    //   next()
    // } else {
    //   next('/login')
    //   // hideLoading();
    // }
     // 验证是跳转到哪个登录页面
    // 验证是否需要跳转统一登录接口
    getSSo().then(res => {
      // 获取url参数
      function GetRequest() {
        var url = location.search // 获取url中"?"符后的字串
        var theRequest = {}

        if (url.indexOf('?') != -1) {
          var str = url.substr(1)
          var strs = str.split('&')
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
          }
        }
        return theRequest
      }

      if (res.data.ssoEnable) { // 取消统一登录验证，需要去除
        if (ssoPost > 0) {
          // 避免死循环登录
          return
        }
        ssoPost++
        // 统一登录，自动登录
        var token = GetRequest().token
        if (GetRequest().token) {
          loginByUsernameBase(token).then(response => {
            const data = response.data

            if (data.status === 0) {
              Message.error('登录失败，请联系管理员。' + data.message || '')
              return
            }
            store.commit('SET_ACCESS_TOKEN', data.access_token)
            store.commit('SET_REFRESH_TOKEN', data.refresh_token)
            store.commit('SET_EXPIRES_IN', data.expires_in)
            store.commit('CLEAR_LOCK')
            next({ path: '/overviews' })
          }).catch(error => {
            Message.error('loginByUsernameBase接口api错误',error)
            console.log(error)
          })
        } else {
          // 需要跳转统一登录接口
          var backUrl = location.origin
          window.location.replace(`${res.data.serverUrl}&clienturl=${backUrl}&RedirectM=get`)
        }
      } else {
        // 跳转到系统自带的登录页
        if (meta.isAuth === false) {
          next()
        } else {
          next('/login')
        }
      }
    }).catch(err => {
      Message.error('统一登录接口api错误')
      console.log(err)
    })
  }
})

router.afterEach(() => {
  // hideLoading();
  const title = store.getters.tag.label
  router.$avueRouter.setTitle(title)
})
