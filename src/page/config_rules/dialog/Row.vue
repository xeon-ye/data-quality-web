<!--
 * @Author: your name
 * @Date: 2020-08-06 09:58:34
 * @LastEditTime: 2020-09-04 14:46:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2\src\page\config_rules\dialog\Row.vue
-->
<!--
*名称:
*描述:
-->
<template>
    <div class="page-row">
        <p class="p">
            行数检测：<br>
            行数检测，又称‘波动率检测’，检查大数据中心是否每天都按时入库数据，入库数据的行数是否有偏倚，是否存在大批量的漏进数据；<br>
            作为表级检测规则，不需要配置字段规则；
        </p>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    // 创建元素前
    created() {},
    // 创建元素后
    mounted() {},
    // 计算属性
    computed: {},
    // 方法
    methods: {},
    // 侦听属性
    watch: {}
};
</script>

<style lang="scss" scoped>
.page-row {
    height: calc(100vh - 100px);
}
.p{
    font-size: 14px;
    color: #666;
    line-height: 26px;
}
</style>