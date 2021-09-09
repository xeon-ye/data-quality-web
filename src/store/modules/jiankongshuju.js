/*
 * @Author: your name
 * @Date: 2021-03-05 17:55:19
 * @LastEditTime: 2021-03-05 18:30:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\store\modules\jiankongshuju.js
 */

const jiankongshuju = {

    state:{
        SEARCHVAL:'',
    },

    mutations: {
        SET_SEARCHVAL(state, val){
            state.SEARCHVAL = val
        },
    }
}


export default jiankongshuju
