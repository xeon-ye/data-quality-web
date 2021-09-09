/*
 * @Author: your name
 * @Date: 2021-03-10 15:16:13
 * @LastEditTime: 2021-03-11 17:17:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\store\modules\wentifankui.js
 */
const wentifankui = {

    state: {
        SOUSHUOALL: {
            id: '',
            hospital: '',
            model: '',
            table: '',
            rule: '',
            timeType: 'day',
            businessTime: '',
            user: ''
        },
        ROWDATA: null,
        TYPELISTALL: null,
        FANKUISHENHEVAL: '',
    },

    mutations: {
        SET_SOUSHUOALL(state, val) {
            state.SOUSHUOALL = val
        },

        SET_ROWDATA(state, val) {
            state.ROWDATA = val
        },

        SET_TYPELISTALL(state, val) {
            state.TYPELISTALL = val
        },

        SET_FANKUISHENHEVAL(state, val) {
            state.FANKUISHENHEVAL = val
        },
    }
}


export default wentifankui