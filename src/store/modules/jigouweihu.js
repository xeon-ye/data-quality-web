/*
 * @Author: your name
 * @Date: 2021-03-08 16:01:36
 * @LastEditTime: 2021-03-08 16:16:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\store\modules\jigouweihu.js
 */
const jigouweihu = {

    state:{
        DIALOGVISIBLE:false,
    },

    mutations: {
        SET_DIALOGVISIBLE(state, val){
            state.DIALOGVISIBLE = val
        },
    }
}


export default jigouweihu