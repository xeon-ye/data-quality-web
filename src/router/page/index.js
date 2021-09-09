/*
 * @Author: your name
 * @Date: 2020-09-21 15:56:57
 * @LastEditTime: 2021-04-06 09:52:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clin-ui\src\router\page\index.js
 */
// import Layout from '@/page/index/'
export default [{
    path: '/login',
    name: '登录页',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/page/Login'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/',
    // name: '系统首页',
    redirect: '/overviews'
},
{
    path: '/',
        // component: Layout,
    component: () => import(/* webpackChunkName: "home" */ '@/components/common/Home.vue'),
    children: [
        {
            path: '/overviews',
            name: '首页预览',
            component: () => import(/* webpackChunkName: "dashboard" */ '@/page/overviews'),
            // meta: { title: '质量概览月报' }
        },
        {
            path: '/addrules',
            name: 'addrules',
            component: () => import(/* webpackChunkName: "AddRules" */ '@/page/config_rules/AddRules.vue'),
            meta: { title: '新增分组' },
            children: [
        
                {
                    path: '/after/:model/:table',
                    name: 'after',
                    components: {
                        guize_page: () => import('@/page/config_rules/After.vue')
                    },
                    meta: { title: '' },
                    children: [
                        {
                            path: '/dialog/Dialog',
                            components: {
                                default: () => import('@/page/config_rules/dialog/Dialog.vue')
                            },
                            meta: { title: '' },
                            children: [
                                {
                                    path: '/dialog/SourceTarget',
                                    components: {
                                        default: () => import('@/page/config_rules/dialog/SourceTarget.vue')
                                    },
                                    meta: { title: '' }
                                },
                                {
                                    path: '/dialog/ZhuanMa',
                                    components: {
                                        default: () => import('@/page/config_rules/dialog/ZhuanMa.vue')
                                    },
                                    meta: { title: '' }
                                },
                                {
                                    path: '/dialog/NonEmpty',
                                    components: {
                                        default: () => import('@/page/config_rules/dialog/NonEmpty.vue')
                                    },
                                    meta: { title: '' }
                                },
                                {
                                    path: '/dialog/Enum',
                                    components: {
                                        default: () => import('@/page/config_rules/dialog/Enum.vue')
                                    },
                                    meta: { title: '' }
                                },
                                {
                                    path: '/dialog/Row',
                                    components: {
                                        default: () => import('@/page/config_rules/dialog/Row.vue')
                                    },
                                    meta: { title: '' }
                                },
                                {
                                    path: '/dialog/MainDetail',
                                    components: {
                                        default: () => import('@/page/config_rules/dialog/MainDetail.vue')
                                    },
                                    meta: { title: '' }
                                },
                                {
                                    path: '/dialog/Abs',
                                    components: {
                                        default: () => import('@/page/config_rules/dialog/Abs.vue')
                                    },
                                    meta: { title: '' }
                                },
                                {
                                    path: '/dialog/JiShiXing',
                                    components: {
                                        default: () => import('@/page/config_rules/dialog/JiShiXing.vue')
                                    },
                                    meta: { title: '' }
                                }
                            ]
                        }
                    ]
                },
                {
                    path: '/addrules/before',
                    name: 'before',
                    // component: () => import(/* webpackChunkName: "before" */ '../page/config_rules/Before.vue'),
                    components: {
                        peizhiguize: () => import(/* webpackChunkName: "before" */ '@/page/config_rules/Before.vue')
                    },
                    meta: { title: '事前规则' }
                }
                // 弹窗配置页面
                // {
                //     path:'/addrules/dialogguizi',
                //     name: 'dialogview',
                //     components:{
                //         guize_page:() => import(/* webpackChunkName: "after" */ '../page/config_rules/After.vue'),
                //         guize_comn:() =>import(/* webpackChunkName: "dialogview" */ '../page/config_rules/dialog/view.vue')
                //     }
        
                // },
            ]
        }
    ]
},
{
    path: '/qualityrule',
    component: () => import(/* webpackChunkName: "home" */ '@/components/common/Home.vue'),
    redirect: '/qualityrule/index',
    children: [{
        path: 'index',
        name: '质量管理规则',
        component: () =>
            import( /* webpackChunkName: "page2" */ '@/page/qualityrule')
    }]
},
{
    path: '/qualitystandard',
    component: () => import(/* webpackChunkName: "home" */ '@/components/common/Home.vue'),
    redirect: '/qualitystandard/index',
    children: [{
        path: 'index',
        name: '质量评估标准',
        component: () =>
            import( /* webpackChunkName: "page2" */ '@/page/qualitystandard')
    }]
},
{
    path: '/journal',
    component: () => import(/* webpackChunkName: "home" */ '@/components/common/Home.vue'),
    redirect: '/journal/index',
    children: [{
        path: 'index',
        name: '日志',
        component: () =>
            import( /* webpackChunkName: "page2" */ '@/page/journal')
    }]
},
{
    path: '/masterData',
    component: () => import(/* webpackChunkName: "home" */ '@/components/common/Home.vue'),
    redirect: '/masterData/index',
    children: [{
        path: 'index',
        component: () =>
            import( /* webpackChunkName: "page2" */ '@/page/masterData')
    }]
},
{
    path: '/metaData',
    component: () => import(/* webpackChunkName: "home" */ '@/components/common/Home.vue'),
    redirect: '/metaData/index',
    children: [{
        path: 'index',
        component: () =>
            import( /* webpackChunkName: "page2" */ '@/page/metaData')
    }]
},
{
    path: '/404',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/components/page/404'),
    name: '404',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: true
    }

},
{
    path: '/403',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/components/page/403'),
    name: '403',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/500',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/components/page/500'),
    name: '500',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},

// {
//     path: '/myiframe',
//     component: Layout,
//     redirect: '/myiframe',
//     children: [{
//         path: ":routerPath",
//         name: 'iframe',
//         component: () =>
//             import( /* webpackChunkName: "page" */ '@/components/iframe/main'),
//         props: true
//     }]
// },
{
    path: '*',
    redirect: '/404',
}
]
