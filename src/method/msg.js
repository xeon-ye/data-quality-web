/*
 * @Author: your name
 * @Date: 2021-01-21 14:17:24
 * @LastEditTime: 2021-01-25 09:18:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\method\msg.js
 */
import { MessageBox, Message } from 'element-ui';

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


export function msgBox(txt,error = '') {
    console.log('error :>> ', error);
    
    MessageBox(`${txt}${error}`, '错误信息', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'warning',
            message: `action: ${ action }`
          });
        }
      });
}

