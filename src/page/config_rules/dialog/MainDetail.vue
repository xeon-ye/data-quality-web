<!-- 主子关联规则 -->
<template>
    <div class="page">
        <header class="meiju-header-dialog">
            <div class="left-title-dialog">主子关系检测</div>
            <div class="remarks">
                <el-input v-model="comment" placeholder="请填写备注信息" size="mini"></el-input>
            </div>
        </header>
        <main class="x-main-zhenghe">
            <!-- 模式：0字段，1纯sql -->
            <el-switch
                    class="mar-10"
                    v-model="mode"
                    active-text="SQL"
                    :active-value="1"
                    :inactive-value="0"
                    inactive-text="模型">
            </el-switch>
            <div v-if="mode===1" class="in-coder-panel">
                <!-- SQL模式 -->
                <el-row style="height: calc(100% - 50px);">
                    <el-col :span="12" style="height: calc(100% - 50px);width: calc(50% - 50px);"><SqlEditor ref="sqleditor" :value="sql" class="sql-editor-warp"/></el-col>
                    <el-col :span="12" style="height: calc(100% - 50px);width: calc(50% - 50px);"><SqlEditor ref="demo" :value="sqlDemo" class="sql-editor-warp" read-only/></el-col>
                </el-row>
                <el-button type="primary" size="small" class="sql-btn" @click="formatSql(sql)">
                    格式化sql
                </el-button>
            </div>
            <div v-if="mode!==1" class="xh-scrollbar">
                <!-- 模型模式 -->
                <el-scrollbar class="xh-scrollbar">
                    <el-row class="x-row">
                        <el-col :span="10">
                            <div class="grid-content">
                                <!-- 左侧表格 -->
                                <div class="table-title">子表：{{ detailTable }}（{{ detailTableComment }}）</div>
                                <div class="right">
                                    <el-table
                                            :data="detail"
                                            style="width: 100%"
                                            highlight-current-row
                                            current-row-key="index"
                                            :row-class-name="ableRowClassName"
                                            @row-click="detailSelect"
                                            :default-sort="{prop: 'sort', order: 'descending'}">
                                        <el-table-column label="序" type="index" width="50" prop="seq"></el-table-column>
                                        <el-table-column prop="field" label="字段名称" show-overflow-tooltip></el-table-column>
                                        <el-table-column prop="fieldComment" label="中文名称" show-overflow-tooltip></el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </el-col>

                        <!-- 中间连接线 -->
                        <el-col :span="4">
                            <div class="grid-content child-border-none">
                                <ul class="line-ul">
                                    <li class="line-li" v-for="(item, index) in lines" :key="index">
                                        <el-button
                                                :data-xindex="index"
                                                type="danger"
                                                icon="el-icon-close"
                                                circle
                                                size="mini"
                                                @click="del(index)"
                                        ></el-button>
                                    </li>
                                </ul>
                            </div>
                        </el-col>

                        <!-- 右侧表格 -->
                        <el-col :span="10">
                            <div class="table-title">
                                <div class="select">
                                    <el-select v-model="mainTable" placeholder="请选择" @change="tableChange" class="kyle">
                                        <el-option
                                                v-for="(item, index) in tables"
                                                :key="index"
                                                :label="`主表：`+item.tableName+`（`+item.tableComment+`）`"
                                                :value="item.tableName"
                                                style="width:300px"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </div>

                            <div class="grid-content">
                                <el-table
                                        :data="main"
                                        style="width: 100%"
                                        highlight-current-row
                                        current-row-key="index"
                                        :row-class-name="ableRowClassName"
                                        @row-click="mainSelect">
                                    <el-table-column label="序" type="index" width="50" prop="seq"></el-table-column>
                                    <el-table-column prop="field" label="字段名称" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="fieldComment" label="中文名称" show-overflow-tooltip></el-table-column>
                                </el-table>
                            </div>
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </div>
        </main>
        <footer>
            <el-button type="primary" plain size="mini" @click="saveNew" v-if="id!==''">保存并新增</el-button>
            <el-button type="primary" size="mini" @click="save">保存</el-button>
        </footer>
    </div>
</template>
<script>

import bus from '@/components/common/bus.js';
import sqlFormatter from 'sql-formatter';
import SqlEditor from './SqlEditor.vue';

export default {
    components: {
        SqlEditor
    },
    data() {
        return {
            // 规则类型
            RULE_TYPE: 'main_detail',
            // 模式：0模型，1SQL
            mode: 0,
            sql : '',
            sqlDemo: '/*sql格式*/\n' +
                'select\n' +
                '  count(detail.Case_AdverseEventDet_VisitID) as total, /*子表数据量*/\n' +
                '  count(main.Visit_Record_VisitID) as match  /*主表匹配数据量*/\n' +
                'from\n' +
                '  Case_AdverseEventDet as detail  /*子表*/\n' +
                '  left join (\n' +
                '    select\n' +
                '      Visit_Record_VisitID,  /*关联字段1*/\n' +
                '      Visit_Record_DataSourceFlag,  /*关联字段2*/\n' +
                '    from\n' +
                '      Visit_Record\n' +
                '  ) as main on 1 = 1  /*主表*/\n' +
                '  and detail.Case_AdverseEventDet_VisitID = main.Visit_Record_VisitID  /*主子关联字段1*/\n' +
                '  and detail.Case_AdverseEventDet_DataSourceFlag = main.Visit_Record_DataSourceFlag  /*主子关联字段2*/\n' +
                'where\n' +
                '  1 = 1\n' +
                '  and detail.chargedate between \'2006-08-13 16:00:00\'\n' +
                '  and \'2006-08-14 15:59:59\'  /*时间区间*/\n' +
                '  ...  /*其余业务筛选条件*/',
            // 0非模板，1模板
            isTemplate: 0,
            // 规则备注
            comment: '',
            // 规则id
            id: '',
            // 模型
            model: '',
            // 医联体code
            hospital: '',
            // 当前数据源表清单
            tables: [],

            // 子表
            detailTable: '',
            // 字表中文名
            detailTableComment: '',
            // 主表
            mainTable: '',
            mainTableBackup: '',

            // 子表字段列表
            detail: [],
            // 主表字段列表
            main: [],
            // 主表字段临时存放
            mainBackup: [],

            // 用来计数要连接几条线,建立了几条关系
            lines: 0,
            // 默认连线备份
            linesBackup: 0,
            // 主子关系
            relation: {
                // 当前选中的子表字段
                detail: '',
                // 当前选中的主表字段
                main: ''
            }
        };
    },

    // 创建元素前
    async created() {
        // 初始值
        this.id = this.$route.query.id;
        this.model = this.$route.query.model;
        this.detailTable = this.$route.query.table;
        this.hospital = this.$route.query.hospital;
        await this.queryTables();
    },
    // 创建元素后
    mounted() {
        this.queryMainDetail();
    },
    // 计算属性
    computed: {},
    // 方法
    methods: {
        /**
         * 查询表
         */
        async queryTables() {
            this.$R.tables({
                model: this.model
            }).then(data => {
                this.tables = data;
                data.forEach(item => {
                    if (item.tableName === this.detailTable) {
                        this.detailTableComment = item.tableComment;
                    }
                });
            });
        },
        /**
         * 查询字段
         */
        async queryFields(table) {
            return this.$R.fields({
                model: this.model,
                table: table
            });
        },
        /**
         * 查询主子关系规则
         */
        queryMainDetail() {
            this.$R.queryMainDetail({
                id: this.id,
                model: this.model,
                tableName: this.detailTable,
                hospital: this.hospital
            }).then(data => {
                this.id = data.id;
                this.comment = data.comment;
                this.isTemplate = data.isTemplate;
                this.mainTable = data.mainTable;
                this.detailTable = data.detailTable;
                this.mode = data.mode;
                this.main = data.main || [];
                this.detail = data.detail || [];
                this.mainBackup = this.main;
                this.linesBackup = this.lines;
                this.mainTableBackup = this.mainTable;

                if(data.sql != null){
                    this.sql = data.sql.sqlScript;
                    this.setSql(this.sql);
                }

                // 创建关系
                if (this.main.length > 0) {
                    this.connect();
                }

                if(this.id != null){
                    // 通知父级路由刷新
                    bus.$emit('menu', this.RULE_TYPE + this.id);
                }else{
                    bus.$emit('menu', this.RULE_TYPE);
                }
            });
        },
        /**
         * 查询主表字段
         */
        async tableChange(table) {
            let that = this;
            if (table === that.mainTableBackup) { // 建立连接的表
                that.main = that.mainBackup;
                that.lines = that.linesBackup;
                that.connect();
            } else { // 非建立连接的表
                that.main = await that.queryFields(table);
                that.lines = 0;
                // 清空排序
                that.detail.forEach(item => {
                    item.sort = 0;
                });
            }
        },
        /**
         * 渲染连接
         */
        connect() {
            let that = this;
            that.lines = 0;
            that.detail.forEach(foo => {
                if (foo.sort > 0) {
                    that.lines++;
                }
            });
        },
        /**
         * 新增主子关系
         */
        detailSelect(row) {
            this.add('detail', row);
        },
        mainSelect(row) {
            this.add('main', row);
        },
        add(type, row) {
            let that = this;
            let descending = function(a, b) {
                if (a.sort > b.sort) {
                    return -1;
                } else if (a.sort === b.sort) {
                    return 0;
                } else {
                    return 1;
                }
            };

            // 选中子表
            if (type === 'detail') {
                that.relation.detail = row.index;
            }
            // 选中主表
            if (type === 'main') {
                that.relation.main = row.index;
            }

            // 选好两个字段
            if (that.relation.detail !== '' && that.relation.main !== '') {

                // 生成新的连线
                ++that.lines;

                // 将对应的字段移到最前面，匹配连线的位置
                that.detail.forEach(item => {
                    if (item.index === that.relation.detail) {
                        item.sort = that.lines;
                    }
                });
                that.main.forEach(item => {
                    if (item.index === that.relation.main) {
                        item.sort = that.lines;
                    }
                });

                // 排序，将建立关系的元素排在最前
                that.detail.sort(descending);
                that.main.sort(descending);

                // 清空选中关系
                that.relation.detail = '';
                that.relation.main = '';
            }

        },
        /**
         * 删除主子关系
         */
        del(index) {
            let that = this;
            // 移除关系
            that.detail.forEach(item => {
                if (item.sort === index) {
                    item.sort = 0;
                } else if (item.sort > index) {
                    item.sort--;
                }
            });
            that.main.forEach(item => {
                if (item.sort === index) {
                    item.sort = 0;
                } else if (item.sort > index) {
                    item.sort--;
                }
            });
            // 删除横线
            that.lines--;
        },
        /**
         * 保存
         */
        save() {
            this.$R.modifyMainDetail({
                id: this.id,
                isTemplate: this.isTemplate,
                model: this.model,
                detailTable: this.detailTable,
                mainTable: this.mainTable,
                dept: this.hospital,
                detail: this.detail,
                main: this.main,
                mode: this.mode,
                comment: this.comment,
                sql : this.$refs.sqleditor === undefined? this.sql : this.$refs.sqleditor.editor.getValue()
            }).then(id => {
                if (id !== undefined) {
                    this.id = id;
                    this.queryMainDetail();
                    bus.$emit('menu', this.RULE_TYPE + id);
                    this.$message.success("主子关系规则保存成功");
                }
            });
        },
        /**
         * 新增
         */
        saveNew(){
            this.$R.modifyMainDetail({
                isTemplate: this.isTemplate,
                model: this.model,
                detailTable: this.detailTable,
                mainTable: this.mainTable,
                dept: this.hospital,
                detail: this.detail,
                main: this.main,
                mode: this.mode,
                comment: this.comment,
                sql : this.$refs.sqleditor === undefined? this.sql : this.$refs.sqleditor.editor.getValue()
            }).then(id => {
                if (id !== undefined) {
                    this.id = id;
                    this.queryMainDetail();
                    bus.$emit('menu', this.RULE_TYPE + id);
                    this.$message.success("主子关系规则保存成功");
                }
            });
        },
        ableRowClassName({ row, rowIndex }) {
            row.index = rowIndex;
        },
        /**
         * 格式化sql
         */
        formatSql() {
            let dom = this.$refs.sqleditor;
            dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()));
        },
        setSql(sql){
          let dom = this.$refs.sqleditor;
          if(dom){
              dom.editor.setValue(sqlFormatter.format(sql));
          }
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
            this.lines = 0;
            this.dbname = to.query.dbname;
            this.table = to.query.table;
            this.hospital = to.query.hospital;
            this.id = to.query.id;
            this.queryMainDetail();
        }
    }
};
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #666;
    overflow: auto;

    padding-right: 10px;

    header {
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: space-between;
        height: 40px;
        align-items: center;

        .right {
            padding-right: 20px;
        }
    }
}

footer {
    padding-right: 20px;
    text-align: right;
}

// 连线
.line-ul {
    position: relative;
    padding-top: 60px;

    .line-li {
        width: 100%;
        height: 2px;
        background: #36c;
        margin-top: 40px;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            background: #36c;
            transform: translate(-50%, -50%);
        }

        button.el-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
        }

        &::before {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            background: #36c;
            transform: translate(50%, -50%);
            z-index: 100;
        }
    }

    .line-li:hover {
        cursor: pointer;
        width: 100%;
        height: 2px;
        background: #f54e62;
        margin-top: 40px;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            background: #f54e62;
            transform: translate(-50%, -50%);
        }

        button.el-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: block;
        }

        &::before {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            background: #f54e62;
            transform: translate(50%, -50%);
            z-index: 100;
        }
    }
}

.table-title {
    height: 40px;
    background: #293152;
    color: #fff;
    font-size: 12px;
    line-height: 40px;
    padding-left: 10px;
    display: flex;
    padding-right: 10px;
    justify-content: space-between;
}

.kyle ::v-deep .el-input__inner {
    padding: 0;
    width: 100%;
    background: transparent;
    border: none;
    color: #fff;
}

.table-title {
    ::v-deep .select {
        width: 100%;
    }

    ::v-deep .el-select {
        width: 100%;
    }
}

.kyle-ziduan {
    ::v-deep .el-select {
        width: 130px;
        margin-right: 10px;
        margin-left: 10px;
    }

    ::v-deep .el-input__inner {
        border-radius: 0;
    }
}

.x-main-zhenghe {
    height: calc(100vh - 200px);
    overflow: hidden;
    padding-right: 0;
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
