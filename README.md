<!--
 * @Author: your name
 * @Date: 2021-01-20 14:18:06
 * @LastEditTime: 2021-03-16 14:03:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\README.md
-->

代理地址：
http://192.168.0.112:7077/compare

API 文档地址：
http://192.168.0.112:7077/compare/swagger-ui.html#/361363732731649297023526821017

# element 修改

## element 添加

`值4个：xh-icon-btns-primary；xh-icon-btns-success；xh-icon-btns-warning；xh-icon-btns-danger；`
<i class="el-icon-delete xh-icon-btns-danger" @click="shanChu(scope.row)"></i>

# 全局 bus 事件

``

# 全局消息提示

```
    Vue.prototype.msgSuccess = msgSuccess
    Vue.prototype.msgWarning = msgWarning
    Vue.prototype.msgError = msgError
    Vue.prototype.msgBox = msgBox

    使用：this.msgSuccess(msg)
```

# 通用样式

## 布局样式

```
mar-10 pad-10 ； pad-t-10 ；t,b,l,r, 10, 20
```

## table 样式

```
    操作按钮：
```

# 更新

打包的时候url去除lg
<!-- adduser组件添加修改参数 -->
