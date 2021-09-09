<template>
    <div class="page">

        <header class="meiju-header-dialog">

            <div class="left-title-dialog">非空检测</div>

            <div class="remarks">
                <!--                <el-input v-model="remarks" placeholder="请填写备注信息" size="mini"></el-input>-->
            </div>

        </header>

        <main class="main-table">
            <!-- 模型模式 -->
            <el-scrollbar class="xh-scrollbar">
                <el-table
                    :data="fields"
                    stripe
                    style="width: 100%"
                    ref="nonEmptyTable"
                    tooltip-effect="dark"
                >
                    <el-table-column type="index" label="序" width="90"></el-table-column>
                    <el-table-column prop="field" label="字段名称" width="250"></el-table-column>
                    <el-table-column prop="fieldComment" label="中文字段名"></el-table-column>
                    <el-table-column prop="type" label="数据类型"></el-table-column>
                    <el-table-column prop="status" type="selection" label="是否非空检测" width="180"></el-table-column>
                </el-table>
            </el-scrollbar>
        </main>

        <footer class="meiju-footer">
            <el-button type="primary" size="mini" @click="save">保存</el-button>
        </footer>

    </div>
</template>
<script>

import bus from '@/components/common/bus.js';

export default {
    data() {
        return {
            RULE_TYPE: 'non_empty',
            mode: 0,
            id: '',
            model: '',
            table: '',
            hospital: '',
            isTemplate: '',
            fields: []
        };
    },
    // 创建元素前
    created() {
        // 初始值
        this.id = this.$route.query.id;
        this.model = this.$route.query.model;
        this.table = this.$route.query.table;
        this.hospital = this.$route.query.hospital;
        // 查询非空字段
        this.queryNonEmpty();
    },
    // 创建元素后
    mounted() {},
    // 计算属性
    computed: {},
    // 方法
    methods: {
        /**
         * 查询非空规则
         */
        queryNonEmpty() {
            let that = this;
            that.$R.queryNonEmpty({
                id: this.id,
                model: this.model,
                tableName: this.table,
                hospital: this.hospital
            }).then(data => {
                // if(data != null && data.id != null){
                if(data != null){
                    that.isTemplate = data.isTemplate;
                    that.fields = data.fields;
                    that.mode = data.mode;
                    if(data.sql != null){
                        that.sql = data.sql.sqlScript;
                    }
                    // checkbox 默认选中
                    that.$nextTick(() => {
                        that.fields.forEach(row => {
                            if (row.status === 1) {
                                this.$refs.nonEmptyTable.toggleRowSelection(row, true);
                            }
                        });
                    });
                    // 通知父级路由刷新
                    bus.$emit('menu', this.RULE_TYPE + (this.id||""));
                }else{
                    bus.$emit('menu', this.RULE_TYPE);
                }
            });
        },
        /**
         * 保存
         */
        save() {
            let that = this;
            that.$R.modifyNonEmpty({
                id: this.id,
                model: this.model,
                mode: this.mode,
                tableName: this.table,
                dept: this.hospital,
                isTemplate: this.isTemplate,
                fields: this.$refs.nonEmptyTable.selection,
            }).then(id=>{
                that.id = id;
                // 通知父级路由刷新
                bus.$emit('menu', this.RULE_TYPE + id);
                this.$message.success("非空规则保存成功");
            })
        }

    },

    // 侦听属性
    watch: {
        /**
         * 左侧菜单切换更新子页面数据
         * @param to
         * @param from
         */
        $route(to, from) {
            this.model = to.query.model;
            this.table = to.query.table;
            this.hospital = to.query.hospital;
            this.id = to.query.id;
            this.queryNonEmpty();
        }
    }


};
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    padding-right: 10px;
}

.meiju-header {
    width: 100%;
    height: 50px;
    font-size: 14px;
    color: #666;
    align-items: center;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
}

.main-table {
    display: block;
    border: 1px solid #ebeef5;
    border-bottom: 0;
    height: calc(100vh - 200px);
    overflow: hidden;
}

.main-table {
    ::v-deep .el-checkbox__input::after {
        padding-left: 20px;
        position: absolute;
        left: 0;
        top: 0;
        content: '是否非空检测';
    }
}

.meiju-footer {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.right-btns {
    ::v-deep .el-select {
        margin-right: 10px;
    }
}

::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
}
</style>