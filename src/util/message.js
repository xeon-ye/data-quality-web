/*
 * @Author: your name
 * @Date: 2020-09-22 17:30:40
 * @LastEditTime: 2021-01-27 16:59:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clin-ui\src\util\message.js
 */
import { Message, Loading, MessageBox   } from 'element-ui';

export function msgSuccess(txt) {
    Message({
        message: txt,
        type: 'success'
    })
}

export function msgWarning(txt) {
    Message({
        message: txt,
        type: 'warning'
    })
}

export function msgError(txt) {
    Message({
        message: txt,
        type: 'error'
    })
}

export function xhLoading() {
    return Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
    })
}

export function xhMsg(txt,title = '提示'){
    MessageBox(txt,title, {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          });
        }
      });
}