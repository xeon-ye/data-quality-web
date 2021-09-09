<!--
 * @Author: your name
 * @Date: 2020-08-06 09:58:34
 * @LastEditTime: 2020-09-01 13:57:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2\src\page\config_rules\AddRules.vue
-->

<template>
    <div class="fullpage">
        <div class="leftwarp left">
            <LeftMenu></LeftMenu>
        </div>

        <div class="main">
            <TopMenu></TopMenu>
            <router-view name="guize_page" class="kl-page"></router-view>
        </div>
    </div>
</template>
<script>
import LeftMenu from './LeftMenu';
import TopMenu from './TopMenu';

export default {
    components: {
        LeftMenu,
        TopMenu
    },
    data() {
        return {
            // 子集路由是否显示
            showTanChuangView: true
        };
    },
    // 创建元素前
    created() {},
    // 创建元素后
    mounted() {
        // console.log();
    },
    // 计算属性
    computed: {},
    // 方法
    methods: {
        // 返回上一级页面
        goBackPage: function() {
            this.$router.push({ name: 'after' });
            this.showTanChuangView = false;
        }
    },
    // 侦听属性
    watch: {}
};
</script>

<style lang="scss" scoped>
::v-deep .splitter-paneR {
    background: #fff;
}

::v-deep .splitter-pane-resizer {
    background: transparent;
}

.leftwarp {
    width: 200px;
    height: calc(100vh - 80px);
    margin-right: 6px;
}
.split-pane {
    width: 100%;
}
.fullpage {
    width: 100%;
    display: flex;
    flex-flow: row;
    height: 100%;
    overflow: auto;
}
.left {
    width: 200px;
    height: 100%;
    overflow: auto;
    flex-shrink: 0;
}

.main {
    width: 0;
    flex: 1;
    height: 100%;
    background: #fff;
}

.kl-page {
    height: calc(100% - 35px);
    overflow: auto;
}

::v-deep .after-scrollbar {
    width: 100%;
    height: 100%;
}
::v-deep .el-scrollbar__wrap {
    overflow: scroll;
}
::v-deep .el-scrollbar__bar {
    bottom: 40px;
    opacity: 1;
}
</style>
