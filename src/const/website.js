/*
 * @Author: your name
 * @Date: 2020-11-02 09:36:58
 * @LastEditTime: 2021-04-06 09:26:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clin-ui\src\const\website.js
 */
export default {
    title: '柯林布瑞',
    logo: '柯林布瑞',
    key: '柯林布瑞',   //配置主键,目前用于存储
    indexTitle: '柯林布瑞',
    whiteList: ['/login', '/404', '/401', '/lock'], // 配置无权限可以访问的页面
    whiteTagList: ['/login', '/404', '/401', '/lock'], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
    lockPage: '/lock',
    tokenTime: 6000,
    infoTitle: '柯林布瑞',
    statusWhiteList: [428],
    // 配置首页不可关闭
    isFirstPage: false,
    fistPage: {
        label: '首页预览',
        value: '/overviews',
        path: '/overviews',
        params: {},
        query: {},
        group: [],
        close: false
    },

    // 配置菜单的属性
    menu: {
        props: {
            label: 'label',
            path: 'path',
            icon: 'icon',
            children: 'children'
        }
    }
}
