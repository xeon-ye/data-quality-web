<!-- 源目检测 -->
<template>
    <div class="yuanmu_page">
        <header class="meiju-header-dialog">
            <div class="left-title-dialog">源目检测</div>
            <div class="remarks">
                <el-input v-model="desc" placeholder="请填写备注信息" size="mini"></el-input>
            </div>
        </header>
        <!-- 左边语句输入框 -->
        <el-row>
            <el-col :span="24" class="xh-left-warp">
                <header>
                    <div class="left">
                        <el-radio-group v-model="isTarget" size="mini">
                            <el-radio-button :label="true">目配置</el-radio-button>
                            <el-radio-button :label="false">源配置</el-radio-button>
                        </el-radio-group>
                    </div>
                </header>

                <div class="in-coder-panel">
<!--                    <SqlEditor ref="sqleditor" :value="showSql" class="sql-editor-warp"/>-->

                    <el-row style="height: calc(100% - 50px);">
                        <el-col :span="12" style="height: calc(100% - 50px);width: calc(50% - 50px);"><SqlEditor ref="sqleditor" :value="showSql" class="sql-editor-warp"/></el-col>
                        <el-col :span="12" style="height: calc(100% - 50px);width: calc(50% - 50px);"><SqlEditor ref="demo" :value="sqlDemo" class="sql-editor-warp" read-only/></el-col>
                    </el-row>

                    <el-select class="sql-select" type="primary" v-model="sourceModel" size="small" v-if="!isTarget">
                        <el-option v-for="item in models" :key="item.name" :label="item.name"
                                   :value="item.name"></el-option>
                    </el-select>
                    <el-button type="primary" size="small" class="sql-btn" @click="formatSql(showSql)">
                        格式化sql
                    </el-button>
                </div>
            </el-col>
        </el-row>
        <footer>
            <el-button type="primary" plain size="mini" @click="add" v-if="id!==''">保存并新增</el-button>
            <el-button type="primary" size="mini" @click="save">保存</el-button>
        </footer>
    </div>
</template>
<script type="text/ecmascript-6">

import sqlFormatter from 'sql-formatter';
import SqlEditor from './SqlEditor.vue';
import bus from '@/components/common/bus.js';

export default {
    name: 'in-coder',
    components: {
        SqlEditor
    },
    data() {
        return {
            // 规则类型
            RULE_TYPE: 'source_target',
            // 规则备注
            desc: '',
            // 规则id
            id: '',
            // true目，false源
            isTarget: true,
            // 0非模板，1模板
            isTemplate: 0,
            // tab显示的数据：目，源
            showSql: '',
            sqlDemo: '/*源目检测sql模板*/\n' +
                'select (核查字段1 || 核查字段2 || 核查字段3 || ...) as str /*将字段拼成字符串，注：源与目相同字段应处于同一位置*/\n' +
                'from 核查表\n' +
                'where 时间区间字段 between 开始时间 and 结束时间',
            // 目标库模型
            targetModel: '',
            // 目标库sql
            targetSql: '',
            // 源库模型
            sourceModel: '',
            // 源库sql
            sourceSql: '',
            // 表名
            table: '',
            // 医联体code
            hospital: '',
            // 数据库码表
            models: [],
            // 富文本框样式
            code: {
                content: 'code',
                cmOptions: {
                    value: '',
                    mode: 'text/x-mysql', // 模式
                    theme: 'xh', // css样式选择
                    indentUnit: 2, // 缩进单位，默认2
                    smartIndent: false, // 是否智能缩进
                    tabSize: 4, // Tab缩进，默认4
                    readOnly: false, // 是否只读，默认false
                    showCursorWhenSelecting: true,
                    lineNumbers: true, //是否显示行号
                    firstLineNumber: 1
                }
            }
        };
    },
    created() {
        // 流程数据
        this.id = this.$route.query.id || '';
        this.targetModel = this.$route.query.model;
        this.table = this.$route.query.table;
        this.hospital = this.$route.query.hospital;
        // 查询db码表
        this.queryModel();
    },
    mounted() {
        // 查询详情
        this.getRule();
    },
    methods: {
        /**
         * 查询业务模型
         */
        queryModel() {
          this.$R
              .queryDict({
                types: 'model'
              })
              .then((res) => {
                this.models = res.model;
              });
        },
        /**
         * 查询规则详情
         */
        getRule() {
            this.$R.querySourceTarget({
                id: this.id,
                model: this.targetModel,
                tableName: this.table,
                hospital: this.hospital
            }).then(data => {
                if (data != null) {
                    // 规则描述
                    this.desc = data.comment || '';
                    // 规则id
                    this.id = data.id || '';
                    // 是否为模板
                    this.isTemplate = data.isTemplate || 0;
                    // 目标表规则
                    this.targetModel = data.target.model;
                    this.targetSql = data.target.sqlScript;
                    // 源表规则
                    this.sourceModel = data.source.model;
                    this.sourceSql = data.source.sqlScript;
                    // 页面显示的sql
                    if(this.isTarget){
                        this.showSql = this.targetSql;
                    }else{
                        this.showSql = this.sourceSql;
                    }
                    // 把之前的sql代码格式后粘贴到表单里
                    this.$refs.sqleditor.editor.setValue(sqlFormatter.format(this.showSql));
                    // 通知父级路由刷新
                    bus.$emit('menu', this.RULE_TYPE + this.id);
                } else {
                    bus.$emit('menu', this.RULE_TYPE);
                }

            });
        },
        /**
         * 保存源目规则
         */
        save() {

            if(this.isTarget){ // 如果当前是目标端
                this.targetSql = this.$refs.sqleditor.editor.getValue();
            }else{ // 如果当前是源端
                this.sourceSql = this.$refs.sqleditor.editor.getValue();
            }

            if(this.desc === '' || this.targetSql === '' ||  this.sourceSql === '' || this.sourceModel === ''){
                this.$message.error("请填写完整数据");
                return;
            }

            this.$R.modifySourceTarget({
                id: this.id,
                comment: this.desc,
                model: this.targetModel,
                tableName: this.table,
                dept: this.hospital,
                isTemplate: this.isTemplate,
                target: {model: this.targetModel, sqlScript: this.targetSql},
                source: {model: this.sourceModel, sqlScript: this.sourceSql}
            }).then(id => {
                this.id = id;
                this.getRule();
                bus.$emit('menu', this.RULE_TYPE + id);
                this.$message.success("源目规则保存成功");
            });
        },
        /**
         * 保存并新增
         */
        add() {
            if(this.desc === '' || this.targetSql === '' ||  this.sourceSql === '' || this.sourceModel === ''){
                this.$message.error("请填写完整数据");
                return;
            }
            this.$R.modifySourceTarget({
                comment: this.desc,
                model: this.targetModel,
                tableName: this.table,
                dept: this.hospital,
                isTemplate: this.isTemplate,
                target: {model: this.targetModel, sqlScript: this.targetSql},
                source: {model: this.sourceModel, sqlScript: this.sourceSql}
            }).then(id => {
                this.id = id;
                this.getRule();
                bus.$emit('menu', this.RULE_TYPE + id);
                this.$message.success("源目规则保存成功");
            });
        },
        /**
         * 格式化sql
         */
        formatSql() {
            let dom = this.$refs.sqleditor;
            dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()));
        }
    },
    watch: {
        /**
         * 源目tab切换：true目，false源
         */
        isTarget() {
            // 切换前sql
            this.showSql = this.$refs.sqleditor.editor.getValue();
            // 保存切换前的数据
            if (this.isTarget) {//目
                this.sourceSql = this.showSql;
                this.showSql = this.targetSql;
            } else {// 源
                this.targetSql = this.showSql;
                this.showSql = this.sourceSql;
            }
            // 换切换后sql
            if (this.showSql !== undefined) {
                this.$refs.sqleditor.editor.setValue(sqlFormatter.format(this.showSql));
            } else {
                this.$refs.sqleditor.editor.setValue(sqlFormatter.format(""));
            }

        },
        /**
         * 左侧菜单切换更新子页面数据
         * @param to
         * @param from
         */
        $route(to, from) {
            this.targetModel = to.query.model;
            this.table = to.query.table;
            this.hospital = to.query.hospital;
            this.id = to.query.id;
            this.getRule();
        }
    }
};
</script>

<style lang="scss" scoped>
header {
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
}

.yuanmu_page {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
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

footer {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  margin-top: 20px;
}

.xh {
  padding: 0 20px;

  .title {
    margin: 0;
    padding: 0;
    color: #666;
    font-size: 12px;
    line-height: 36px;
  }

  .box {
    border: 1px solid #eee;
    border-bottom: 0;
  }

  .whert-body {
    min-height: 80px;
    background: #f5f5f5;
    font-size: 12px;
    color: #555;
    padding: 20px;
  }
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}

.remarks {
  margin-top: 10px;
}

.xh-left-warp, .xh-right-warp {
  height: calc(100vh - 200px);
  overflow: auto;
}

</style>
