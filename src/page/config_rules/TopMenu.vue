<!--
*名称:规则管理头部切换导航组件
*描述:
-->
<template>
    <div class="page">
        <el-menu
            :default-active="activeIndex"
            class="k-menu"
            mode="horizontal"
            router
            @select="handleSelect"
        >
            <!--<el-menu-item index="/addrules/before">事前规则</el-menu-item>-->
<!--            <el-menu-item index="/addrules/after">事后规则</el-menu-item>-->
            <el-menu-item>事后规则</el-menu-item>
        </el-menu>
        <div class="right-buts">
<!--            <el-link icon="icon iconfont iconxieyuanguanxi" :underline="false">血缘关系</el-link>-->
            <el-link icon="icon iconfont iconfanhui" :underline="false" @click="goBack">返回</el-link>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activeIndex: '/addrules/after'
        };
    },
    // 创建元素前
    created() {},
    // 创建元素后
    mounted() {},
    // 计算属性
    computed: {},
    // 方法
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);
        },
        // 返回配置规则主页
        goBack(){
            this.$router.push({ path: '/qualityrule'})
        }
    },
    // 侦听属性
    watch: {}
};
</script>

<style lang="scss" scoped>
.page {
    width: 100%;
    position: relative;
    .el-menu {
        width: 100%;
    }
    .el-menu--horizontal > .el-menu-item {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
    }
    .el-menu--horizontal > .el-menu-item.is-active {
        color: #1890ff;
        border-bottom: 1px solid #1890ff;
        font-weight: bold;
    }
    .right-buts {
        position: absolute;
        right: 10px;
        top: 0;
        &::v-deep .el-link.el-link--default {
            color: #666;
            font-size: 12px;
            line-height: 30px;
        }
        &::v-deep .el-link.el-link--default:hover {
            color: #21aced;
        }
        &::v-deep .iconxieyuanguanxi {
            color: #d58747 !important;
            margin-right: 10px;
            margin-left: 15px;
            font-size: 18px;
        }

        &::v-deep .iconfanhui {
            color: #2370c3 !important;
            margin-right: 10px;
            margin-left: 15px;
            font-size: 14px;
        }
    }
}
</style>