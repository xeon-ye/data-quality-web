import { Message, MessageBox, Loading } from 'element-ui';
import axios from 'axios';
import service from './api.js';
import errorCode from '@/const/errorCode'
import Vue from 'vue';
import VueRouter from 'vue-router';
import routerConfig from '@/router';
import store from "@/store";

import { showLoading, hideLoading } from '../page/js/loading';


Vue.use(VueRouter);
const router = new VueRouter(routerConfig);

// 实例axios对象
let instance = axios.create({
    // 默认.env.local，此文件不上传
    baseURL: "/clinbrain/api",
    timeout: 1000*60,
    headers: {
        //'Access-Control-Allow-Origin': '*'

    }
});

const R = {}; // 包裹请求方法的容器

// 循环获取请求的数据
try {
    for (let key in service) {
        let api = service[key];
        if (api.method === 'get') {
            R[key] = async function(data) {
                let response = await instance.get(api.url, {
                    params: data,
                    resAll: api.resAll || false
                });
                return response;
            };
        } else if (api.method === 'post') {
            R[key] = async function(data, urlStr = '') {
                let response = await instance.post(api.url + urlStr, data, { resAll: api.resAll || false });
                return response;
            };
        } else if (api.method === 'put') {
            R[key] = async function(data, urlStr = '') {
                let response = await instance.put(api.url + urlStr, data, { resAll: api.resAll || false })
                return response;
            };
        } else if (api.method === 'delete') {

            R[key] = async function(data, urlStr = '') {
                let response = await instance.delete(api.url + urlStr, {
                    params: data
                });
                return response;
            };

        }

    }
} catch (e) {
    console.log("111")
    Message({
        message: e
    });
}


// 请求拦截器
instance.interceptors.request.use(function(config) {

    // 在发送请求之前做些什么
    // Loading.service({
    //     text: 'loading...',
    //     spinner: 'el-icon-loading',
    //     // fullscreen: false,
    //     background: 'rgba(0, 0, 0, 0.7)'
    // });

    showLoading();
    const isToken = (config.headers || {}).isToken === false
    let token =  store.getters.access_token
    if (token && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + token// token
    }
    return config;
}, function(error) {

    // 对请求错误做些什么
    // Message({
    //     message: '恭喜你，这是一条成功消息',
    //     type: 'warning'
    // });
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function(res) {
    // 对响应数据做点什么
    // Loading.service({}).close()
    hideLoading();

    const status = Number(res.status) || 200
    const message = res.data.msg || errorCode[status] || errorCode['default']
    if (status === 401) {
      store.dispatch('FedLogOut').then(() => {
        router.push({path: '/login'})
      })
      return
    }
  
    if (status !== 200 || res.data.code === 1) {
        MessageBox({
            message: message,
            callback: () => {
                // router.replace('/login');
            }
        });
        return Promise.reject(new Error(message))
    }
  
    return res.config.resAll ? res.data : res.data.data

}, function(error) {

    if (error.message.indexOf('timeout') >= 0) {
        MessageBox({
            message: '请求超时，请检查网络！',
            callback: () => {
                // 关闭loading
                Loading.service({}).close();
                // router.replace('/login');
            }
        });
        return;
    }
    // router.replace('/login');
    // 对响应错误做点什么
    MessageBox({
        message: error,
        callback: () => {
            // router.replace('/login');
            Loading.service({}).close();
        }
    });
    return Promise.reject(error);
});

export default R;
