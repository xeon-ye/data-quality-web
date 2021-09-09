<!--
*名称:维护配置规则名称--弹窗组件
*描述:维护页面和规则配置主页面新增需要
-->
<template>
    <div class="page"  v-if="showdialog">
        <div>
            <el-dialog
                title="新增分组"
                :visible.sync="dialogVisible"
                width="340px"
                :close-on-click-modal="false"
                :show-close="false"
                custom-class="k-dialog"
            >
                <el-form :model="xinzengform">
                    <el-form-item label="数据源" :label-width="formLabelWidth">
<!--                        <el-select v-model="xinzengform.shujuyuan" placeholder="请选择数据源">-->
<!--                            &lt;!&ndash; <el-option label="数据源一" value="shanghai"></el-option>-->
<!--                            <el-option label="数据源二" value="beijing"></el-option>&ndash;&gt;-->
<!--                            <el-option-->
<!--                                v-for="(item,index) in selectXinZengSJK"-->
<!--                                :key="index"-->
<!--                                :label="item.type"-->
<!--                                :value="item.type"-->
<!--                            ></el-option>-->
<!--                        </el-select>-->
                        <el-input v-model="xinzengform.shujuyuan" placeholder="请输入数据源"></el-input>
                    </el-form-item>
                    <el-form-item label="数据库" :label-width="formLabelWidth">
                        <el-select
                            v-model="xinzengform.shujuku"
                            placeholder="请选择数据库"
                            @change="setSelectSL"
                        >
                            <!-- <el-option label="数据库一" value="shanghai"></el-option>
                            <el-option label="数据库二" value="beijing"></el-option>-->
                            <el-option
                                v-for="(item,index) in selectXinZengSJY"
                                :key="index"
                                :label="item.connectionCode"
                                :value="item.connectionCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="实例" :label-width="formLabelWidth">
                        <el-select v-model="xinzengform.shili" placeholder="请选择实例">
                            <!-- <el-option label="数据库一" value="shanghai"></el-option>
                            <el-option label="数据库二" value="beijing"></el-option>-->
                            <el-option
                                v-for="(item,index) in selectXinZengSL"
                                :key="index"
                                :label="item.name"
                                :value="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="xinzengform.name" placeholder="请填写名称"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="hideDialog">取 消</el-button>
                    <el-button type="primary" @click="addGuiZhe">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        showdialog: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            // 新增分组是否显示--弹窗
            dialogVisible: true,
            formLabelWidth: '60px',
            xinzengform: {
                name: '',
                shujuyuan: '',
                shujuku: '',
                shili: ''
            },
            selectXinZengSJK: [], // 数据库
            selectXinZengSJY: [], // 下拉数据源
            selectXinZengSL: [] // 下拉数据实例
        };
    },
    // 创建元素前
    created() {
        // 请求分组数据源
        this.getGroupData((res) => {
            // 渲染数据源表单
            this.selectXinZengSJK = res;
        });
        // 请求数据库做下拉渲染
        this.getETL({}, (res) => {
            this.selectXinZengSJY = res;
        });
    },
    // 创建元素后
    mounted() {},
    // 计算属性
    computed: {},
    // 方法
    methods: {
        // 传值给父元素
        hideDialog() {
            this.$emit('isdialog', false);
        },
        // 新增分组
        addGuiZhe() {
            // (this.dialogVisible = false), this.$router.push({ name: 'after', params: { id: 'peizhiguize' } });
            // 验证数据源、数据库、实例、分组名、是否为空
            if (!this.xinzengform.shujuyuan) {
                this.$message({
                    message: '请选择数据源',
                    type: 'warning'
                });
                return;
            }
            if (!this.xinzengform.shujuku) {
                this.$message({
                    message: '请选择数据库',
                    type: 'warning'
                });
                return;
            }
            if (!this.xinzengform.shili) {
                this.$message({
                    message: '请选择实例',
                    type: 'warning'
                });
                return;
            }
            if (!this.xinzengform.name) {
                this.$message({
                    message: '请填写名称',
                    type: 'warning'
                });
                return;
            }
            // 提交数据保存
            this.saveGroup({
                datasource: this.xinzengform.shujuku,
                dbtype: '', // 该参数需要后台确认，先传空
                desc: this.xinzengform.name,
                instance: this.xinzengform.shili,
                type: this.xinzengform.shujuyuan
            });
            this.xinzengform.name = '';
            this.xinzengform.shujuyuan = '';
            this.xinzengform.shujuku = '';
            this.xinzengform.shili = '';
            // 保存成功隐藏弹窗
            this.hideDialog();
            this.$message({
                message: '保存成功',
                type: 'success'
            });
            // // 跳转页面---
            // * 下面内容需要组件中区分是否需要页面跳转
            // *1、在维护页面头部+号弹窗，的不需要页面跳转。
            // * 2、而在配置规则主页的时候需要添加页面跳转功能。
            // this.$router.push({ name: 'after', params: { type: this.xinzengform.shujuyuan, table: this.xinzengform.shujuku } });
        },
        // 获取新增分组的数据
        async getGroupData(callback) {
            // let res = await this.$R.groupquery();
            // if (!res) {
            //     return;
            // }
            // callback(res);
        },

        // 获取ETL数据源信息
        async getETL(obj, callback) {
            // let res = await this.$R.etlquery({
            //     database: obj.database || '',
            //     instance: obj.instance || '',
            //     table: obj.table || ''
            // });
            // if (!res) {
            //     return;
            // }
            // // 回调进行数据操作
            // if (callback) {
            //     callback(res);
            // }
        },
        // 选择数据之后，请求对应的实例获取数据
        setSelectSL() {
            if (this.selectXinZengSJK) {
                this.getETL(
                    {
                        database: this.xinzengform.shujuku
                    },
                    (res) => {
                        this.selectXinZengSL = res;
                    }
                );
            }
        },
        // 保存新增分组
        async saveGroup(obj) {
            let res = await this.$R.groupsave({
                datasource: obj.datasource,
                dbtype: obj.dbtype,
                desc: obj.desc,
                instance: obj.instance,
                type: obj.type
            });
            if (!res) {
                return;
            }
            this.xinzengform.name = '';
            this.xinzengform.shujuyuan = '';
            this.xinzengform.shujuku = '';
            this.xinzengform.shili = '';
            this.$message({
                message: '数据保存成功',
                type: 'success'
            });
            // 把数据清空
            // xinzengform: {
            //     name: '',
            //     shujuyuan: '',
            //     shujuku: '',
            //     shili: ''
            // },
        },
        // 新增分组按钮事件
        showGroupings() {
            // 显示分组弹窗
            // this.dialogVisible = true;
            // 请求分组数据源
            this.getGroupData((res) => {
                // 渲染数据源表单
                this.selectXinZengSJK = res;
            });
            // 请求数据库做下拉渲染
            this.getETL({}, (res) => {
                this.selectXinZengSJY = res;
            });
        }
    },
    // 侦听属性
    watch: {}
};
</script>

<style lang="scss" scoped>
::v-deep .el-button {
    margin-left: 20px !important;
}
</style>