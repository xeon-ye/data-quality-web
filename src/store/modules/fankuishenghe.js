/*
 * @Author: your name
 * @Date: 2021-03-09 18:13:40
 * @LastEditTime: 2021-03-09 18:24:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\store\modules\fankuishenghe.js
 */
const fankuishenghe = {

    state: {
        SHOWJILU: false,
        SHOWKNOWLEDGE: false,
        FANKUIROWDATA: null,
        SELECTION: {}
    },

    mutations: {
        SET_SHOWJILU(state, val) {
            state.SHOWJILU = val
        },
        SET_SHOWKNOWLEDGE(state, val) {
            state.SHOWKNOWLEDGE = val
        },
        SET_FANKUIROWDATA(state, val) {
            state.FANKUIROWDATA = val
        },
        SET_SELECTION(state, val) {
            console.log(val.id)
            state.SELECTION = val
        },
    }
}


export default fankuishenghe