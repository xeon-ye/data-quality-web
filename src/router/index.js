import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
// 重写router，避免重复点击保错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/overviews'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            children: [
                {
                    path: '/overviews',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../page/overviews'),
                    meta: { title: '质量概览' }
                },
                {
                    path: '/jigouweihu',
                    component: () => import(/* webpackChunkName: "jigouweihu" */ '../page/jigouweihu.vue'),
                    meta: { title: '机构维护' }
                },
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../page/dashboard.vue'),
                    meta: { title: '日审分析' }
                },
                {
                    path: '/reporting',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../page/reporting.vue'),
                    meta: { title: '上报数据' }
                },
                {
                    path: '/countReport',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../page/countReport.vue'),
                    meta: { title: '上报数据情况' }
                },
                {
                    path: '/journal',
                    component: () => import(/* webpackChunkName: "journal" */ '../page/journal/index.vue'),
                    meta: { title: '日志' }
                },
                {
                    path: '/knowledgepower',
                    component: () => import(/* webpackChunkName: "knowledgepower" */ '../page/knowledgepower.vue'),
                    meta: { title: '知识库' }
                },
                {
                    path: '/qualityrule',
                    component: () => import(/* webpackChunkName: "qualityrule" */ '../page/qualityrule/index.vue'),
                    meta: { title: '质量管理规则' }
                },
                {
                    path: '/qualitystandard',
                    component: () => import(/* webpackChunkName: "qualitystandard" */ '../page/qualitystandard/index.vue'),
                    meta: { title: '质量标准' }
                },
                {
                    // 富文本编辑器组件
                    path: '/questionexamine',
                    component: () => import(/* webpackChunkName: "questionexamine" */ '../page/questionexamine.vue'),
                    meta: { title: '反馈审核' }
                },
                {
                    // markdown组件
                    path: '/questionfeedback',
                    component: () => import(/* webpackChunkName: "questionfeedback" */ '../page/questionfeedback.vue'),
                    meta: { title: '问题反馈' }
                },
                {
                    // 图片上传组件
                    path: '/systemsettings',
                    component: () => import(/* webpackChunkName: "systemsettings" */ '../page/SystemSettings.vue'),
                    meta: { title: '系统设置' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/responsible',  
                    component: () => import(/* webpackChunkName: "responsible" */ '../page/responsible.vue'),
                    meta: { title: '责任人维护' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '访问错误' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '没有权限' }
                },
                {
                    path: '/qualityReport',
                    name: 'qualityReport',
                    component: () => import(/* webpackChunkName: "qualityReport" */ '../page/qualityReport.vue'),
                    meta: { title: '质量报告' }
                },
                {
                    path: '/addrules',
                    name: 'addrules',
                    component: () => import(/* webpackChunkName: "AddRules" */ '../page/config_rules/AddRules.vue'),
                    meta: { title: '新增分组' },
                    children: [

                        {
                            path: '/after/:model/:table',
                            name: 'after',
                            components: {
                                guize_page: () => import('../page/config_rules/After.vue')
                            },
                            meta: { title: '' },
                            children: [
                                {
                                    path: '/dialog/Dialog',
                                    components: {
                                        default: () => import('../page/config_rules/dialog/Dialog.vue')
                                    },
                                    meta: { title: '' },
                                    children: [
                                        {
                                            path: '/dialog/SourceTarget',
                                            components: {
                                                default: () => import('../page/config_rules/dialog/SourceTarget.vue')
                                            },
                                            meta: { title: '' }
                                        },
                                        {
                                            path: '/dialog/ZhuanMa',
                                            components: {
                                                default: () => import('../page/config_rules/dialog/ZhuanMa.vue')
                                            },
                                            meta: { title: '' }
                                        },
                                        {
                                            path: '/dialog/NonEmpty',
                                            components: {
                                                default: () => import('../page/config_rules/dialog/NonEmpty.vue')
                                            },
                                            meta: { title: '' }
                                        },
                                        {
                                            path: '/dialog/Enum',
                                            components: {
                                                default: () => import('../page/config_rules/dialog/Enum.vue')
                                            },
                                            meta: { title: '' }
                                        },
                                        {
                                            path: '/dialog/Row',
                                            components: {
                                                default: () => import('../page/config_rules/dialog/Row.vue')
                                            },
                                            meta: { title: '' }
                                        },
                                        {
                                            path: '/dialog/MainDetail',
                                            components: {
                                                default: () => import('../page/config_rules/dialog/MainDetail.vue')
                                            },
                                            meta: { title: '' }
                                        },
                                        {
                                            path: '/dialog/Abs',
                                            components: {
                                                default: () => import('../page/config_rules/dialog/Abs.vue')
                                            },
                                            meta: { title: '' }
                                        },
                                        {
                                            path: '/dialog/JiShiXing',
                                            components: {
                                                default: () => import('../page/config_rules/dialog/JiShiXing.vue')
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
                                peizhiguize: () => import(/* webpackChunkName: "before" */ '../page/config_rules/Before.vue')
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
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
