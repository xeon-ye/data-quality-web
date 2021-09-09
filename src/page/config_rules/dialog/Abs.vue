<template>
    <div class="page">

        <header class="meiju-header-dialog">
            <div class="left-title-dialog">绝对值检测</div>
            <div class="remarks">
                <!--                <el-input v-model="remarks" placeholder="请填写备注信息" size="mini"></el-input>-->
            </div>
        </header>

        <main class="main-table">
            <!-- 模式：0字段，1纯sql -->
<!--            <el-switch-->
<!--                    class="mar-10"-->
<!--                    v-model="mode"-->
<!--                    active-text="SQL"-->
<!--                    :active-value="1"-->
<!--                    :inactive-value="0"-->
<!--                    inactive-text="模型">-->
<!--            </el-switch>-->
            <!-- SQL模式 -->
<!--            <div v-if="mode===1" class="in-coder-panel">-->
<!--                &lt;!&ndash; SQL模式 &ndash;&gt;-->
<!--                <el-row style="height: calc(100% - 50px);">-->
<!--                    <el-col :span="12" style="height: calc(100% - 50px);width: calc(50% - 50px);"><SqlEditor ref="sqleditor" :value="sql" class="sql-editor-warp"/></el-col>-->
<!--                    <el-col :span="12" style="height: calc(100% - 50px);width: calc(50% - 50px);"><SqlEditor ref="demo" :value="sqlDemo" class="sql-editor-warp" read-only/></el-col>-->
<!--                </el-row>-->
<!--                <el-button type="primary" size="small" class="sql-btn" @click="formatSql(sql)">-->
<!--                    格式化sql-->
<!--                </el-button>-->
<!--            </div>-->
            <!-- 模型模式 -->
            <div class="xh-scrollbar">
                <el-scrollbar class="xh-scrollbar">
                    <el-table
                            :data="fields"
                            stripe
                            style="width: 100%"
                            ref="multipleTable"
                            tooltip-effect="dark"
                            :row-class-name="tableRowClassName"
                            highlight-current-row
                    >
                        <el-table-column type="index" label="序"></el-table-column>
                        <el-table-column prop="field" label="字段名称"></el-table-column>
                        <el-table-column prop="fieldComment" label="中文名称"></el-table-column>
                        <el-table-column prop="type" label="数据类型"></el-table-column>

                        <el-table-column label="绝对值值域" width="320px">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-col :span="8">
                                        <el-select v-model="scope.row.lowerOperator" style="width: 100px">
                                            <el-option value=">" label="大于"></el-option>
                                            <el-option value=">=" label="大于等于"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-input v-model="scope.row.lowerValue" type="number" style="width: 70px" v-if="scope.row.type === 'number'"></el-input>
                                        <el-date-picker
                                                v-model="scope.row.lowerValue"
                                                type="datetime"
                                                placeholder="选择日期时间" v-if="scope.row.type === 'date'" style="width: 200px"  value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8">
                                        <el-select v-model="scope.row.upperOperator" style="width: 100px">
                                            <el-option value="<" label="小于"></el-option>
                                            <el-option value="<=" label="小于等于"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-input v-model="scope.row.upperValue" type="number" style="width: 70px" v-if="scope.row.type === 'number'"></el-input>
                                        <el-date-picker
                                                v-model="scope.row.upperValue"
                                                type="datetime"
                                                placeholder="选择日期时间" v-if="scope.row.type === 'date'" style="width: 200px" value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <span style="color: red">{{ scope.row.warning }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-scrollbar>
            </div>
        </main>
        <footer class="meiju-footer">
            <el-button type="primary" size="mini" @click="save">保存</el-button>
        </footer>
    </div>
</template>
<script>

import bus from '@/components/common/bus.js';
import { showLoading, hideLoading } from '@/page/js/loading.js';
import sqlFormatter from 'sql-formatter';
import SqlEditor from './SqlEditor.vue';

export default {
    components: {
        SqlEditor
    },
    data() {
        return {
            RULE_TYPE: 'abs',
            mode: 0,
            sql : '',
            sqlDemo: '/*绝对值查询sql参考*/\n' +
                'select \n' +
                'a.field, /*字段*/\n' +
                'a.total, /*数据量*/\n' +
                'a.detection, /*非空数据量*/\n' +
                'a.satisfied, /*符合绝对值规则数据量*/\n' +
                'a.detection - a.satisfied as unsatisfied, /*不符合绝对值规则数据量*/\n' +
                '(case when a.detection = 0 then 0 else a.satisfied * 100 / a.detection end) as score /*分数*/\n' +
                'from (\n' +
                '  \n' +
                '/*字段1*/\n' +
                'select\n' +
                'count(0) as total,\n' +
                'sum(case when 绝对值核查字段1 is not null and 绝对值核查字段1 != \'\' then 1 end) as detection,\n' +
                'sum(case when 绝对值核查字段1 is not null and 绝对值核查字段1 != \'\' and 绝对值核查字段1 >= 0 then 1 else 0 end as satisfied,\n' +
                '\'绝对值核查字段1\' as field\n' +
                'from 核查表\n' +
                'where\n' +
                '1 = 1\n' +
                'and 业务时间字段 between \'2006-08-13 16:00:00\' and \'2006-08-14 15:59:59\' /*数据时间区间*/\n' +
                '\t\n' +
                'union all\n' +
                '\t\n' +
                '/*字段2*/\n' +
                'select\n' +
                'count(0) as total,\n' +
                'sum(case when 绝对值核查字段2 is not null and 绝对值核查字段2 != \'\' then 1 end) as detection,\n' +
                'sum(case when 绝对值核查字段2 is not null and 绝对值核查字段2 != \'\' and 绝对值核查字段2 >= 0 then 1 else 0 end as satisfied,\n' +
                '\'绝对值核查字段2\' as field\n' +
                'from Fin_Bill_Basic\n' +
                'where\n' +
                '1 = 1\n' +
                'and 业务时间字段 between \'2006-08-13 16:00:00\' and \'2006-08-14 15:59:59\' /*数据时间区间*/\n' +
                '\t\n' +
                'union all\n' +
                '\t\n' +
                '/*字段n*/\n' +
                '...... \n' +
                ') a',
            id: '',
            dbname: '',
            table: '',
            hospital: '',
            isTemplate: '',
            // 模型模式展示字段
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

    },
    // 创建元素后
    mounted() {
        // 查询非空字段
        this.queryAbs();
    },
    // 计算属性
    computed: {},
    // 方法
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 2) {
                return 'success-row';
            }
            return '';
        },
        /**
         * 查询绝对值
         */
        queryAbs() {
            showLoading();
            let that = this;
            that.$R.queryAbs({
                id: this.id,
                model: this.model,
                tableName: this.table,
                hospital: this.hospital
            }).then(data => {
                // if(data != null && data.id != null){
                if(data != null){
                    that.mode = data.mode;
                    that.id = data.id;
                    that.isTemplate = data.isTemplate;
                    that.fields = data.fields;
                    if(data.sql != null){
                        that.sql = data.sql.sqlScript;
                    }
                    // 添加个提示字段
                    that.fields.forEach(n => {
                        n.warning = null;
                    });
                    hideLoading();
                    if(data.id != null){
                        // 通知父级路由刷新
                        bus.$emit('menu', this.RULE_TYPE + this.id);
                    }else{
                        bus.$emit('menu', this.RULE_TYPE);
                    }
                }
            });
        },
        /**
         * 保存绝对值
         */
        save() {
            let that = this;
            let flag = true;
            that.fields.forEach((row, index) => {
                flag = flag && this.validation(row, index);
            });

            if (flag || this.mode === 1) {
                that.$R.modifyAbs({
                    id: this.id,
                    mode: this.mode,
                    model: this.model,
                    tableName: this.table,
                    dept: this.hospital,
                    isTemplate: this.isTemplate,
                    fields: this.fields,
                    sql: this.$refs.sqleditor === undefined? this.sql : this.$refs.sqleditor.editor.getValue()
                }).then(id => {
                    that.id = id;
                    // 通知父级路由刷新
                    bus.$emit('menu', this.RULE_TYPE + id);
                    this.$message.success('绝对值规则保存成功');
                });
            }
        },
        /**
         * 验证
         */
        validation(row, index) {
            let flag = true;
            let isNull = function(val) {
                return val === null || val === undefined || val === '';
            };
            row.warning = null;
            // 验证：每一对value与operator只能同时有值，同时空
            if (isNull(row.lowerValue) === isNull(row.lowerOperator) && isNull(row.upperValue) === isNull(row.upperOperator)) {// 双
                // 最小值大于最大值
                if (row.type == 'number' && isNull(row.lowerValue) === isNull(row.upperValue) && row.lowerValue > row.upperValue) {
                    row.warning = '最大值应大于最小值';
                    flag = false;
                }
            } else {// 单
                row.warning = '请输入完整值';
                flag = false;
            }
            this.$set(this.fields, index, row);
            return flag;
        },
        /**
         * 格式化sql
         */
        formatSql() {
            let dom = this.$refs.sqleditor;
            dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()));
        }
    },
    // 侦听属性
    watch: {}
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  padding-right: 10px;

  .el-table .warning-row {
    background: red;
  }

  .el-table .success-row {
    background: green;
  }
}

.main-table {
  display: block;
  height: calc(100vh - 200px);
  border: 1px solid #ebeef5;
  border-bottom: 0;
  overflow: hidden;
}

.main-table {
  ::v-deep .el-checkbox__input::after {
    padding-left: 20px;
    position: absolute;
    left: 0;
    top: 0;
    content: '是否绝对值检测';
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

::v-deep .xh-scrollbar {
  height: calc(100% - 20px);
}

.in-coder-panel {
  height: calc(100% - 50px);

  .sql-editor-warp {
    height: calc(100% - 50px);
    width: calc(100% - 20px);
    margin-bottom: 10px;
  }

  .sql-btn {
    background: #ffffff;
    border: 1px solid $box_bg2;
    color: #666;
    margin-left: 10px;
  }
}
</style>