/*
 * @Author: your name
 * @Date: 2021-03-05 17:54:26
 * @LastEditTime: 2021-03-10 15:38:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\store\index.js
 */

import Vue from 'vue'
import Vuex from 'vuex'

import jiankongshuju from './modules/jiankongshuju';
import jigouweihu from './modules/jigouweihu';
import fankuishenghe from './modules/fankuishenghe';
import wentifankui from './modules/wentifankui';
import common from './modules/common';
import tags from './modules/tags';
import user from './modules/user';

import getters from './getters'
Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        jiankongshuju,
        jigouweihu,
        wentifankui,
        fankuishenghe,
        common,
        tags,
        user,
    },
    getters
})

export default store