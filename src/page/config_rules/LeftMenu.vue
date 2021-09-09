<!--*配置规则页面-左边导航-->
<template>
    <div class="page">
        <div class="left-box zlbg-left-menu-bg">
            <h1 class="title zlbg-left-menu-title">
                监控规则配置
                <span></span>
                <!-- 右边的新增和刷新、在报告页面需要隐藏此功能 -->
                <div class="right-btns" v-if="isshowbtns">
                    <!-- <el-button icon="el-icon-plus" circle @click="addNewRule"></el-button> -->
                    <el-button icon="el-icon-refresh" circle @click="refresh"></el-button>
                </div>
            </h1>

            <div class="search maring-bottom xh-sarch-rule-left">
                <el-input
                        placeholder="请输入内容"
                        maxlength="50"
                        @keyup.enter.native="searchTree"
                        v-model="searchtxt"
                        class="xh-input">
                    <el-button
                            class="xh-button"
                            slot="append"
                            icon="el-icon-search"
                            @click="searchTree"
                    ></el-button>
                </el-input>
            </div>

            <div class="nav xh-rule-navleftmenu">
                <el-menu
                        background-color="#39436a"
                        text-color="#fff"
                        active-text-color="#21aced"
                        :default-active="menuActive">
                    <!-- 如果3个源里都没有数据则现在以下提示 -->
                    <div class="menu-null" v-if="nullSearch">没有找到要搜索的内容</div>

                    <el-submenu
                            v-for="(item1,index1) in modelList"
                            :index="index1+ ''"
                            :key="index1"
                            v-else>
                        <template slot="title">
                            <i class="icon iconfont iconshujuku"></i>
                            <span>{{ item1.model }}</span>
                        </template>
                        <el-menu-item-group @open="handleOpen" @close="handleClose">
                            <div class="submenu-null" v-if="item1.tableList.length === 0 ">没有要查询的数据库</div>
                            <el-menu-item v-for="(item2,index2) in item1.tableList"
                                          :index="index1+'-'+index2+ ''"
                                          :key="index2"
                                          :xhdbname="item2.model"
                                          :xhtable="item2.tablename"
                                          :title='item2.desc'
                                          @click="queryRuleByTable(item2)">
                                <i class="icon iconfont iconbiao"></i>
                                <!--                                <el-tooltip class="item" effect="dark" :content=item2.dbname placement="top">-->
                                <!--                                    {{ item2.desc | getMaxTableName }} ({{ item2.total }})-->
                                <!--                                </el-tooltip>-->
                                {{ item2.desc | getMaxTableName }}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </div>
        </div>
        <!-- 添加规则配置-弹窗组件 -->
        <DialogAddRule :showdialog="showdialog" @isdialog="getIsDialog"></DialogAddRule>
    </div>
</template>
<script>

// 引入bus进行非父子间传值
import DialogAddRule from '../components/DialogAddRule.vue';
import bus from '@/components/common/bus';

export default {
    components: {
        DialogAddRule
    },
    props: {
        isshowbtns: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            menuActive: '0-0',
            showdialog: false, // 是否显示新增分组弹窗
            nullSearch: false,
            searchtxt: '', // 左侧头部搜索栏
            modelList: [] // 左侧导航数组
        };
    },
    // 创建元素前
    created() {
        this.queryModel();
    },
    // 创建元素后
    mounted() {
        // 根据路由展示对应的数据

        bus.$off('searchTree'); // 先解绑不然会多次调用
        bus.$on('searchTree', (data) => {
            this.searchTree()
        });
    },
    // 计算属性
    computed: {},
    // 方法
    methods: {
        /**
         * 树状结构高亮
         */
        findActIndex(data, check_model, check_table) {
            let model_index = -1;
            let table_index = -1;

            //未选中表的情况-默认选中第一个
            if (check_model === undefined && check_table === undefined) {
                // return
                check_model = this.modelList[0].model
                check_table = this.modelList[0].tableList[0].tablename
                this.$router.push({ name: 'after', params: { model: check_model, table: check_table } });
            }
            data.forEach((n, index1) => {
                if (check_model === n.model) {
                    model_index = index1;
                }
                if (model_index !== undefined) {
                    n.tableList.forEach((m, index2) => {
                        if (m.tablename === check_table) {
                            table_index = index2;
                            return;
                        }
                    });
                }
            });

            console.log(model_index,table_index);

            if (model_index < 0 || table_index < 0) {
                alert('监控规则配置导航没找到要高亮的菜单');
            }
            return `${model_index}-${table_index}`;
        },
        /**
         * 搜索结构检索
         */
        searchTree() {
            this.queryModel(this.searchtxt);
        },
        /**
         * 刷新树状结构
         */
        refresh() {
            (this.searchtxt = ''), this.queryModel('');
        },
        /**
         * 新增规则
         */
        addNewRule() {
            //  显示组件
            this.showdialog = true;
        },
        /**
         * 点击表，查询该表规则
         */
        queryRuleByTable(param) {
            this.$router.push({ name: 'after', params: { model: param.model, table: param.tablename } });
        },
        /**
         * 查询模型表
         */
        async queryModel(keyword = '') {
            let res = await this.$R.model({
                keyword
            });
            this.modelList = res;

            // 颜色是否搜索到子表信息
            let cun = 0;
            if (keyword !== '') {
                for (let i = 0; i < res.length; i++) {
                    // 如果该表下的table为空，cun+1，用来统计是否子表全部为空。
                    if (res[i].tables.length === 0) {
                        cun++;
                    }
                }
            } else {
                this.menuActive = this.findActIndex(res, this.$route.params.model, this.$route.params.table);
            }

            cun === res.length ? (this.nullSearch = true) : (this.nullSearch = false);
        },
        // 获取子组件传递的参数
        getIsDialog(val) {
            this.showdialog = val;
        },
        handleOpen(key, keyPath) {
            // // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // // console.log(key, keyPath);
        }
    },
    // 侦听属性
    watch: {},

    filters: {
        getMaxTableName: function(value) {
            let size = 8;
            if (value.length > size) {
                return value.substr(0, size) + '...';
            } else {
                return value;
            }

        }
    }
};
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-flow: row;
    width: 100%;
    height: 100%;
    background: #39436a;

    .left-box {
        width: 100%;
        height: 100%;
    }

    .right-box {
        flex: 1;
        height: 100%;
        padding: 10px;

        .r-header {
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: space-between;
        }

        .r-box {
            height: 100%;
            overflow: auto;
            // min-height: 456px;
        }

        &::v-deep .el-row {
            height: 100%;
        }

        &::v-deep .el-col {
            height: 100%;
        }

        .right {
            &::v-deep .el-link.el-link--default {
                color: #ededed;
            }

            &::v-deep .el-link.el-link--default:hover {
                color: #21aced;
            }

            &::v-deep .iconshuaxindefuben4 {
                color: #deb73b !important;
                margin-right: 10px;
                margin-left: 15px;
            }

            &::v-deep .iconshuaxinbeifen {
                color: #2bcb5c !important;
                margin-right: 10px;
                margin-left: 15px;
            }

            &::v-deep .iconfanhui {
                color: #2370c3 !important;
                margin-right: 10px;
                margin-left: 15px;
            }
        }
    }
}

/* title 标题带圆圈 */
.title {
    font-size: 12px;
    padding-left: 22px;
    position: relative;
    box-sizing: border-box;
    height: 40px;
    line-height: 40px;

    span::after {
        content: '';
        width: 8px;
        height: 8px;
        background: #21aced;
        overflow: hidden;
        position: absolute;
        left: 10px;
        top: 16px;
        border-radius: 100%;
    }
}

.search {
    padding: 0 10px;

    &.padding-0 {
        padding-left: 0;
    }
}

// 修改element元素样色
.xh-input {
    width: 100%;
    &::v-deep .el-input__inner {
        background: #4d5679;
        border: none;
        border-radius: 0;
        color: #ededed;
    }

    &::v-deep button.el-button {
        background: #4d5679;
        border: none;
        border-radius: 0;
        color: #ededed;
    }

    &::v-deep .el-input-group__append {
        border: none;
        border-radius: 0;
        background: #4d5679;
    }
}

.maring-bottom {
    margin-bottom: 10px;
}

// 修改左边导航样色
.nav {

    height: calc(100vh - 190px);
    overflow: auto;

    &::v-deep .el-menu {
        border: 0;
    }

    &::v-deep .el-submenu {
        line-height: 40px;
    }

    &::v-deep .el-submenu__title {
        height: 40px;
        line-height: 40px;
        font-size: 12px;
    }

    &::v-deep .el-menu-item-group__title {
        display: none;
    }

    &::v-deep .el-menu-item {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        min-width: 100%;
    }

    &::v-deep .el-submenu__icon-arrow,
    &::v-deep .el-icon-arrow-down {
        width: 20px;
        top: 16px;
        left: 10px;
        right: 0;
        transform-origin: 0 0;
        transform: rotateZ(0deg);
        transform-origin: 50% 50%;
        font-size: 16px;
        color: #9ca185;
    }

    &::v-deep .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
        transform-origin: 50% 50%;
        transform: rotateZ(90deg);
    }

    &::v-deep .el-icon-arrow-down:before {
        content: '\e791';
    }

    .iconshujuku {
        color: #21aced !important;
        margin-left: 10px;
    }

    .iconbiao {
        color: #e8bd33 !important;
        margin-right: 5px !important;
    }
}

// 图标样色
.chart-box {
    position: relative;

    .title-etl {
        color: #e6e6e6;
        font-size: 14px;
        position: absolute;
        left: 0px;
        top: 0px;
    }
}

.zlbg-left-menu-title {
    display: flex;
    justify-content: space-between;

    .right-btns {
        padding-right: 0px;
    }
}

.menu-null {
    font-size: 14px;
    width: 100%;
    text-align: center;
    line-height: 36px;
    color: #eee;
}

::v-deep .el-button {
    border: 0;
    background: none;
    margin: 0;
}

::v-deep .el-icon-plus,
::v-deep .el-icon-refresh {
    font-size: 18px;
}

::v-deep .el-icon-plus {
    color: #2370c3;
}

::v-deep .el-icon-refresh {
    color: #fc8f37;
}

::v-deep .el-menu-item-group ul li {
    padding-left: 20px !important;
}


</style>