/*
 * @Author: your name
 * @Date: 2021-01-20 14:18:06
 * @LastEditTime: 2021-03-19 10:24:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\vue.config.js
 */

//  域名添加lg访问的是李根电脑，打包时不需要lg
// let target = "http://192.168.0.112:9999/lg"
// let target = "http://192.168.0.112:9999/data-quality-biz"
let target = "http://127.0.0.1:9999"
// let target = "http://192.168.0.112:9999"
// let target = "http://192.168.0.153:9999"
// let target = "http://192.168.0.114:9999"

module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },

    // 引入scss全局变量
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "@/assets/scss/_variable.scss";`
            },
        }
    },

    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,

    // 代理配置
    devServer: {
        port: 7078,
        open: true,
        proxy: {
            // 与axios的urlbase要一致；
            '/clinbrain/api': {
                changeOrigin: true,
                target: target,
                pathRewrite: {
                    '^/clinbrain/api': ''
                }
            },
        }
    },

}