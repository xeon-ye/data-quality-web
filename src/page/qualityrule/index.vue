<!-- 质量管理规则 -->
<template>
    <div class="quality-rule">
        <!-- 左边导航区域 规则树 and 筛选器 -->
        <div class="left-menu">
            <div class="title">规则树</div>
            <!-- div.规则树 -->
            <div class="leftMenuNull" v-if="ruleList.length === 0">获取数据失败</div>
            <ul @click.stop="getTreeRule">
                <li v-for="(item, index) in ruleList" :key="index" :class="{ act: index == leftmenuact }" :data-rule="item.rule" :data-xindex="index">
                    <span class="ahove cursor" :data-rule="item.rule" :data-xindex="index">{{ item.name }}</span>
                    <span class="nums" :data-rule="item.rule" :data-xindex="index">{{ item.count }}</span>
                </li>
            </ul>
            <!-- div.筛选器 -->
            <div class="title" v-if="paramsList.length > 0">您收藏的筛选器</div>
            <ul>
                <li class="no-pointer favorite-hover" v-for="(item, index) in paramsList" :key="index">
                    <span @click="searchByParam(item)" class="ahove pointer" :data-rule="item.rule" :data-xindex="index">{{ item.name }}</span>
                    <span class="pointer span-padding-20 del" @click="delFavoriteFilter(item.id)">
                        <i class="el-icon-circle-close"></i>
                    </span>
                </li>
            </ul>
        </div>

        <!-- 右边主内容区 -->
        <div class="main">
            <!-- 菜单组 -->
            <div class="main-header" v-show="!showSaiXuanQi">
                <div class="seach">
                    <el-input
                            v-model="keyword"
                            prefix-icon="el-icon-search"
                            maxlength="20"
                            minlength="2"
                            placeholder="请输入关键字"
                            clearable
                            size="mini"
                    ></el-input>
                    <el-button
                            class="seach-m-l-10"
                            type="primary"
                            icon="el-icon-search"
                            size="mini"
                            @click="seachData"
                    >查询
                    </el-button>
                </div>

                <!-- 右侧菜单按钮 -->
                <div class="btns">
<!--                    <el-button-->
<!--                            type="warning"-->
<!--                            icon="icon iconfont iconshaixuan"-->
<!--                            size="mini"-->
<!--                            @click="showShaiXuanqi"-->
<!--                    >筛选器-->
<!--                    </el-button>-->
<!--                    <el-button-->
<!--                            type="primary"-->
<!--                            icon="el-icon-plus"-->
<!--                            size="mini"-->
<!--                            @click="showGroupings"-->
<!--                    >新增分组-->
<!--                    </el-button>-->
                    <el-button
                            type="primary"
                            size="mini"
                            @click="showPattern"
                            class="icon iconfont"
                            :class="SwitchTableIcon"
                    ></el-button>
                </div>
            </div>

            <!-- 筛选器 -->
            <div class="SaiXuanQi" v-show="showSaiXuanQi">
                <el-row class="x-el-row">
                    <el-col :span="6">
                        <span class="title">状态</span>
                        <el-select
                                multiple
                                v-model="zhuangTai"
                                placeholder="请选择"
                                @change="changeZhuangTai"
                        >
                            <el-option
                                    v-for="item in zhuangTaiList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span class="title">操作员</span>
                        <el-select
                                multiple
                                v-model="operator"
                                placeholder="请选择"
                                @change="changeOperator"
                        >
                            <el-option
                                    v-for="item in operatorselect"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span class="title">数据源</span>
                        <el-select v-model="shujuyuan" placeholder="请选择" @change="changeShuJuYuan">
                            <el-option
                                    v-for="item in shujuyuandata"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span class="title">更新日期</span>
                        <el-date-picker
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                @change="changeTime"
                                style="width:260px"
                                v-model="genxinriqi"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                        ></el-date-picker>
                    </el-col>
                </el-row>
                <div class="btns2">
                    <!--
                        *1、点击收藏，弹窗，输入名称。进行报错
                        *2、条件改变之后，重新请求数据，刷新列表。
                    -->
                    <el-button
                            type="warning"
                            size="mini"
                            icon="el-icon-star-off"
                            @click="saveFavorite"
                    >收藏
                    </el-button>
                    <el-button
                            type="danger"
                            size="mini"
                            icon="el-icon-close"
                            @click="showShaiXuanqi"
                    >取消
                    </el-button>
                </div>
            </div>

            <!-- 内容区域 -->
            <div class="hecha-body">
                <div class="box-null" v-if="tableList.length <= 0">
                    没有数据
                    <el-link :underline="false" @click="addRule">新增</el-link>
                </div>

                <template v-if="SwitchTableIcon === 'iconliebiao' ">

                    <div v-for="(db_item, db_index) in tableList" :key="db_index">
                        <div class="titlebox">
                            <div class="title">{{ db_item.model }}数据源</div>
                            <el-link :underline="false" @click="addRule">新增</el-link>
                        </div>

                        <div class="listbox">
                            <el-row :gutter="20">
                                <el-col :span="8"
                                        v-for="(table_item, table_index) in db_item.tables"
                                        :key="table_index">
                                    <div class="itembox">
                                        <!-- 右上角状态 -->
                                        <!-- class:status1:启用；status2：报错；status0；停用 -->
                                        <div class="wiayuan" :class="'status' + (table_item.status||2)">
                                            <div
                                                    class="neiyuan"
                                            >{{ table_item.status == 1 ? '运行中' : '停用' }}
                                            </div>
                                            <!-- 画个矩形来遮住右下角源的颜色 -->
                                            <div class="zhezhao"></div>
                                        </div>

                                        <!-- 右上角状态end -->
                                        <el-tooltip
                                                class="item"
                                                effect="dark"
                                                :disabled="table_item.tablename.length <= 20 || isDisTooltip"
                                                :content="table_item.tablename"
                                                placement="top-start"
                                        >
                                            <div class="title">{{
                                                    table_item.desc | getRuleTitle
                                                }}（{{ table_item.tablename }}）
                                            </div>
                                        </el-tooltip>

                                        <ul>
                                            <!--                                            <li>调度计划：{{ item2.implementationPlan }}</li>-->
                                            <li>
                                                规则数：{{ table_item.total }}
                                                <!--                                                <span-->
                                                <!--                                                    class="dengji"-->
                                                <!--                                                >监控等级：{{ item2.level }}</span>-->
                                            </li>
                                            <li>治理字段：{{table_item.fieldMatch}}/{{table_item.fieldTotal}}</li>
                                            <li>更新时间：{{ table_item.updateTime | moment }}</li>
                                        </ul>
                                        <div class="bofan-icon icon iconfont iconbofang"></div>
                                        <div class="bottom-btns">
                                            <div
                                                    class="bs"
                                                    @click="configRule(table_item.model,table_item.tablename)"
                                                    :data-type="table_item.model"
                                                    :data-table="table_item.tablename"
                                            >
                                                <i class="icon iconfont iconf-maintain-weihu"></i>维护
                                            </div>
                                            <div class="bs" @click="qualityReport(table_item.model,table_item.tablename)">
                                                <i class="icon iconfont iconrizhi"></i>报告
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>

                    </div>

                </template>


                <!-- 切换为table -->
                <div v-else class="table-rule">

                    <el-collapse @change="handleChange">
                        <div v-for="(item, index) in tableList" :key="index">
                            <el-collapse-item class="cb-collapse" :title=" item.model + '数据源'" :name="index">
                                <div class="xh-collapse-item">
                                    <el-table :data="item.tables" border style="width: 100%">
                                        <el-table-column type="index" label="序" width="55"></el-table-column>
                                        <el-table-column prop="tablename" label="表名"></el-table-column>
                                        <el-table-column prop="desc" label="中文名"></el-table-column>
                                        <el-table-column prop="total" label="总规则数"></el-table-column>
                                        <el-table-column prop="sourceTarget" label="源目检测规则数"></el-table-column>
                                        <el-table-column prop="mainDetail"
                                                         label="主子关系检测规则数"></el-table-column>
                                        <el-table-column prop="enum" label="枚举值检测规则数"></el-table-column>
                                        <el-table-column prop="abs" label="绝对值检测规则数"></el-table-column>
                                        <el-table-column prop="nonEmpty" label="非空检测规则数"></el-table-column>
                                        <!-- class:status1:启用；status2：报错；status0；停用 -->
                                        <el-table-column prop="status" label="状态" width="80">
                                            <template slot-scope="scope">
                                                {{ scope.row.status == 1 ? '运行中' : '停用' }}
                                            </template>
                                        </el-table-column>

                                        <el-table-column label="操作" width="100">
                                            <template slot-scope="scope">

                                                <el-button type="text" size="small"
                                                           @click="configRule(scope.row.model,scope.row.tablename)"
                                                           class="icon iconfont iconf-maintain-weihu">
                                                </el-button>

                                                <el-button type="text" size="small"
                                                           @click="qualityReport(scope.row.model,scope.row.tablename)"
                                                           class="icon iconfont iconrizhi">
                                                </el-button>

                                            </template>
                                        </el-table-column>


                                    </el-table>

                                </div>
                            </el-collapse-item>
                        </div>
                    </el-collapse>
                </div>

            </div>
        </div>

        <!-- 新增分组弹窗 -->
        <el-dialog title="新增分组" :visible.sync="dialogVisible" width="340px" custom-class="k-dialog">
            <el-form :model="xinzengform">
                <el-form-item label="数据源" :label-width="formLabelWidth">
                    <!--                    <el-select v-model="xinzengform.shujuyuan" placeholder="请选择数据源">-->
                    <!--                        &lt;!&ndash; <el-option label="数据源一" value="shanghai"></el-option>-->
                    <!--                        <el-option label="数据源二" value="beijing"></el-option>&ndash;&gt;-->
                    <!--                        <el-option-->
                    <!--                            v-for="(item,index) in selectXinZengSJK"-->
                    <!--                            :key="index"-->
                    <!--                            :label="item.type"-->
                    <!--                            :value="item.type"-->
                    <!--                        ></el-option>-->
                    <!--                    </el-select>-->
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
                                v-for="(item, index) in selectXinZengSJY"
                                :key="index"
                                :label="item.connectionCode"
                                :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实例" :label-width="formLabelWidth">
                    <el-select v-model="xinzengform.shili" placeholder="请选择实例">
                        <!-- <el-option label="数据库一" value="shanghai"></el-option>
                        <el-option label="数据库二" value="beijing"></el-option>-->
                        <el-option
                                v-for="(item, index) in selectXinZengSL"
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
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addGuiZhe">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
let leftruleval, // 保留左边元素的值，用来后面查询使用
    vueThat;

import xh from '../js/xh.js';
import bus from '@/util/bus.js';

export default {
    name: 'QualityRule',
    created() {
        this.getLeftTree();
        // 设置晒选器的默认时间
        this.genxinriqi[0] = '2020-01-01';
        this.genxinriqi[1] = xh.getToday();
    },
    data() {
        return {
            // 规则树
            ruleList: [],
            // 默认、被选中的规则
            checkedRule: '',
            // 表预览集合
            tableList: [],
            // 搜索关键字
            keyword: '',

            SwitchTableIcon: 'iconliebiao',
            isDisTooltip: false,

            // 左边导航获取数据失败的提升信息
            leftMenuNull: false,
            // 新增分组是否显示--弹窗
            dialogVisible: false,
            formLabelWidth: '60px',
            xinzengform: {
                name: '',
                shujuyuan: '',
                shujuku: '',
                shili: '',
                dbtype: '',
                reader: '',
                writer: ''
            },
            selectXinZengSJK: [], // 数据库
            selectXinZengSJY: [], // 下拉数据源
            selectXinZengSL: [], // 下拉数据实例

            leftmenuact: 0,
            // 数据列表
            dataLists: [],

            showSaiXuanQi: false,

            // 筛选器
            zhuangTai: [],
            // 赛选器数据列表
            paramsList: [],
            saveFavoriteName: '',
            zhuangTaiList: [
                {
                    value: '1',
                    label: '运行中'
                },
                {
                    value: '0',
                    label: '停运'
                },
                {
                    value: '2',
                    label: '报错'
                }
            ],
            operator: [],
            operatorselect: [
                {
                    value: 'kyle',
                    label: 'kyle'
                },
                {
                    value: 'admin',
                    label: 'admin'
                }
            ],
            shujuyuan: [],
            shujuyuandata: [],

            // 更新日期---
            genxinriqi: []
        };
    },
    methods: {

        /**
         * 规则树，筛选器树
         */
        async getLeftTree() {
            let res = await this.$R.ruleTree({});
            if (!res.rule) {
                // todo 弹出未配置规则码表 dialog
            }
            let _ruleList = [];
            res.rule.forEach((item)=>{
              if(item.rule !== 'row'){
                _ruleList.push(item)
              }
            })
            this.ruleList = _ruleList;
            // 默认选中第一个规则
            this.checkedRule = res.rule[0].rule;
            // 通过规则查询右侧表规则配置预览
            await this.getTableOverview({
                rule: this.checkedRule
            });
            // 赛选器列表 todo
            // this.paramsList = res.params;
        },

        /**
         * 表规则配置预览
         */
        async getTableOverview(param) {
            let params = {
                rule: param.rule,
                keyword: param.keyword
                // dataSource: param.dataSource || '',
                // endTime: param.endTime || '',
                // startTime: param.startTime || '',
                // status: param.status instanceof Array ? param.status.join() : param.status || '',
                // user: param.user instanceof Array ? param.user.join() : param.user || ''
            };
            let res = await this.$R.overview(params);
            this.tableList = res;
        },

        // db->table 收缩 todo 选中的库放在最上面
        handleChange(val) {
            // console.log(val);
        },

        // 显示模式：卡片 or 列表
        showPattern() {
            // 切换icon
            if (this.SwitchTableIcon === 'iconkapian') {
                this.SwitchTableIcon = 'iconliebiao';
            } else {
                this.SwitchTableIcon = 'iconkapian';
            }
        },

        // 进入维护页面
        addRule() {
            // 不带参数跳转到维护页面
            this.$router.push({ name: 'after', params: {} });
        },

        // 维护页面
        configRule(model, table) {
            this.$router.push({ name: 'after', params: { model: model, table: table } });
        },


        /* ************** todo 筛选器 *********************** */

        // 删除收藏的筛选器
        async delFavoriteFilter(id) {
            // console.log(id);
            let res = await this.$R.delfavoritefilterapi({ id });

            this.$message({
                message: '删除成功',
                type: 'success'
            });

            this.getLeftTree();
        },

        // 筛选器功能菜单切换
        showShaiXuanqi() {
            this.showSaiXuanQi = !this.showSaiXuanQi;
        },
        // 筛选器状态选择
        changeZhuangTai() {
            // console.log(this.zhuangTai);
            // if(!genxinriqi){return}
            this.getTableOverview({
                rule: leftruleval,
                dataSource: this.shujuyuan || '',
                endTime: this.genxinriqi[1] + ' 23:59:59' || '',
                startTime: this.genxinriqi[0] + ' 00:00:00' || '',
                status: this.zhuangTai || '',
                user: this.operator || '',
                keyword: this.keyword || ''
            });
        },
        // 筛选器操作员
        changeOperator() {
            // console.log(this.operator);
            this.getTableOverview({
                rule: leftruleval,
                dataSource: this.shujuyuan,
                endTime: this.genxinriqi[1] + ' 23:59:59' || '',
                startTime: this.genxinriqi[0] + ' 00:00:00' || '',
                status: this.zhuangTai,
                user: this.operator
            });
        },
        // 筛选器数据源
        changeShuJuYuan() {
            // console.log(this.shujuyuan);
            this.getTableOverview({
                rule: leftruleval,
                dataSource: this.shujuyuan,
                endTime: this.genxinriqi[1] + ' 23:59:59' || '',
                startTime: this.genxinriqi[0] + ' 00:00:00' || '',
                status: this.zhuangTai,
                user: this.operator
            });
        },
        // 筛选器起始日期
        changeTime() {
            if (!this.genxinriqi) {
                return;
            }
            this.getTableOverview({
                rule: leftruleval,
                dataSource: this.shujuyuan,
                endTime: this.genxinriqi[1] + ' 23:59:59' || '',
                startTime: this.genxinriqi[0] + ' 00:00:00' || '',
                status: this.zhuangTai,
                user: this.operator
            });
        },
        // 保存筛选器信息
        saveFavorite() {
            let that = this;
            // 弹窗，输入name
            this.$prompt('请输入名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[\u4e00-\u9fff\w]{2,16}$/, // 匹配中文，
                inputErrorMessage: '名称格式不正确'
            })
                .then(({ value }) => {
                    // value 输入的 name
                    // this.$message({
                    //     type: 'success',
                    //     message:value +  '，保存成功！ '
                    // });
                    // 提交数据给后台保存
                    that.getFavorite(value);
                })
                .then(() => {
                    // todo 不知道为啥拿不到返回值，这特殊处理一下
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消保存'
                    });
                });
        },
        // 新增分组页面跳转
        qualityReport(model, table) {
            this.$router.push({ path: '/qualityReport', query: { model: model, table: table } });
            bus.$emit("qualityRule", { modelid: model, tablename: table });
        },
        // 顶部查询
        seachData() {
            // 输入框空，查询全部数据
            this.getTableOverview({
                rule: this.checkedRule,
                keyword: this.keyword
            });
        },
        // 新增分组按钮事件
        showGroupings() {
            // 显示分组弹窗
            // this.dialogVisible = true;
            // // 请求分组数据源
            // this.getGroupData((res) => {
            //     // 渲染数据源表单
            //     this.selectXinZengSJK = res;
            // });
            // // 请求数据库做下拉渲染
            // this.getETL({}, (res) => {
            //     this.selectXinZengSJY = res;
            // });
        },
        // 选择数据之后，请求对应的实例获取数据
        setSelectSL(param) {
            // 设置新增数据源类型
            this.xinzengform.shujuku = param.connectionCode;
            this.xinzengform.reader = param.dataflowReader;
            this.xinzengform.writer = param.dataflowWriter;

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
        // 新增分组
        addGuiZhe: function() {
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
                type: this.xinzengform.shujuyuan,
                datasource: this.xinzengform.shujuku,
                dbtype: this.xinzengform.dbtype,
                desc: this.xinzengform.name,
                instance: this.xinzengform.shili,
                reader: this.xinzengform.reader,
                writer: this.xinzengform.writer
            });

            // 保存成功隐藏弹窗
            this.dialogVisible = false;
            // 跳转页面
            this.$router.push({
                name: 'after',
                params: { type: this.xinzengform.shujuku, instance: this.instance, table: this.xinzengform.shili }
            });
        },


        // 点击左边树，更新右边列表信息
        getTreeRule(e) {
            this.checkedRule = e.target.dataset.rule;
            // 高亮当前点击的元素
            this.leftmenuact = e.target.dataset.xindex;
            // 保留点击的规则，便于后面传值使用
            leftruleval = e.target.dataset.rule;
            // 把点击的列表的值，传入请求信息列表，并渲染新的数据
            this.getTableOverview({
                rule: e.target.dataset.rule
            });
        },
        // 点击赛选器触发查询
        searchByParam(e) {
            let params = {
                dataSource: e.dataSource || '',
                endTime: e.endTime || '',
                rule: leftruleval,
                startTime: e.startTime || '',
                status: e.status instanceof Array ? e.status.join() : e.status || '',
                user: e.user instanceof Array ? e.user.join() : e.user || ''
            };
            this.getTableOverview(params);
        },

        /* **********************************页面跳转累******************************************************* */


        // 提交筛选区的配置为收藏
        /* name：用户输入的名称 */
        async getFavorite(name) {
            let params = {
                dataSource: this.shujuyuan,
                endTime: this.genxinriqi[1] + ' 23:59:59',
                id: '', // 默认传空，需要后台确认。
                startTime: this.genxinriqi[0] + ' 00:00:00',
                status: this.zhuangTai.join(','), // 改成提交数组
                user: this.operator.join(','),
                name: name
            };

            let res = await this.$R.paramssave(params);

            // 这里直接写请求成功的操作即可，请求失败，封装的请求接口会弹窗提示的。
            this.$message({
                message: name + ' ，保存成功',
                type: 'success'
            });
        },

        // 获取新增分组的数据
        async getGroupData(callback) {
            let res = await this.$R.groupquery();
            if (!res) {
                return;
            }
            callback(res);
        },

        // 获取ETL数据源信息
        async getETL(obj, callback) {
            let res = await this.$R.etlquery({
                database: obj.database || '',
                instance: obj.instance || '',
                table: obj.table || ''
            });
            // 回调进行数据操作
            if (callback) {
                callback(res);
            }
        },

        // 保存新增分组
        async saveGroup(obj) {
            let res = await this.$R.groupsave({
                datasource: obj.datasource,
                dbtype: obj.dbtype,
                desc: obj.desc,
                instance: obj.instance,
                type: obj.type,
                reader: obj.reader,
                writer: obj.writer
            });

            this.$message({
                message: '数据保存成功',
                type: 'success'
            });
        }
    },

    beforeCreate: function() {
        vueThat = this;
    },

    filters: {
        getRuleTitle: function(value) {
            // 如果浏览器宽度大于1400，不需要隐藏数据
            // console.log(window.screen.width);
            if (window.screen.width > 1400) {
                return value;
            } else {
                if (value && value.length > 20) {
                    return value.substr(0, 20) + '...';
                } else {
                    return value;
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.bottom-btns > div {
  font-size: 18px;

  .icon {
    font-size: 18px;
    padding-right: 5px;
  }
}

.left-menu {
  height: 100%;
  overflow: auto;
}

.quality-rule {
  &::v-deep .iconfont {
    font-size: 12px;
    margin-right: 10px;
  }

  position: relative;
  height: calc(100vh - 108px);
  display: flex;
  flex-direction: row;

  .main {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: #f5f5f5;

    .main-header,
    .SaiXuanQi {
      box-sizing: border-box;
      padding: 0 20px;
      height: 40px;
      background: #fff;
      border-bottom: 1px solid #efeff0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .seach {
        width: 380px;
        display: flex;
        justify-content: space-between;
      }
    }

    .SaiXuanQi {
      width: 100%;
      height: auto;
      min-height: 90px;
      padding-bottom: 10px;
      display: block;

      .title {
        display: inline-block;
        margin-right: 10px;
        font-size: 12px;
        color: #808080;
      }

      .el-row {
        padding-top: 10px;
      }
    }
  }
}

.el-row {
  width: 100%;
}

.seach-m-l-10 {
  margin-left: 10px;
}

.btns2 {
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.hecha-body {
  padding: 0 0 50px 20px;

  .titlebox {
    font-size: 14px;
    color: #808080;
    height: 40px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    margin-bottom: -20px;
  }

  .itembox {
    height: 174px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    align-content: space-between;
    margin-top: 20px;

    .bofan-icon {
      font-size: 66px;
      width: 100px;
      position: absolute;
      top: 47px;
      left: -30px;
      z-index: 1;
    }

    .iconfont {
      color: #f7f7fb !important;
    }

    ul {
      display: block;
      position: absolute;
      z-index: 10;
      left: 20px;
      font-size: 14px;
      line-height: 26px;
      color: #999;
      bottom: 20px;
    }

    .title {
      font-size: 16px;
      color: #3366cc;
      font-weight: bold;
    }

    .dengji {
      display: inline-block;
      margin-left: 30px;
    }

    .bottom-btns {
      display: none;
    }
  }

  .table-rule {
    margin-top: 20px;
  }

  .itembox:hover {
    .bottom-btns {
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 52px;
      background: rgba(51, 102, 204, 0.8);
      z-index: 100;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.5);

      .bs {
        .iconfont {
          margin: 5px;
          color: rgba(255, 255, 255, 0.5) !important;
        }
      }

      .bs:hover {
        color: #fff;
        font-weight: bold;
        cursor: pointer;

        .iconfont {
          margin: 5px;
          color: rgba(255, 255, 255, 1) !important;
        }
      }
    }
  }
}

// 状态:0停用，1启用，2报错
.wiayuan {
  width: 70px;
  height: 70px;
  position: absolute;
  top: 20px;
  right: 20px;
  background: #2cb828;
  border-radius: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .neiyuan {
    width: 54px;
    height: 54px;
    overflow: hidden;
    border-radius: 100%;
    background: #fff;
    z-index: 1000;
    line-height: 54px;
    text-align: center;
    color: #2cb828;
    font-size: 14px;
  }

  .zhezhao {
    position: absolute;
    right: -2px;
    bottom: -2px;
    width: 40px;
    height: 40px;
    background: #cedeec;
  }
}

div.status1 {
  background: #2cb828;

  .neiyuan {
    color: #2cb828;
  }
}

div.status2 {
  background: #f77973;

  .neiyuan {
    color: #f77973;
  }
}

div.status0 {
  background: #cedeec;

  .neiyuan {
    color: #cedeec;
  }
}

.x-el-row {
  padding-right: 20px;
}

.box-null {
  width: 100%;
  color: #555;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  .el-link {
      float: right;
      margin-right: 40px;
  }
}

.leftMenuNull {
  padding-left: 20px;
}

.span-padding-20 {
  padding-right: 20px;
}

.el-icon-circle-close {
  font-size: 16px;
}

.del {
  display: none;
}

.favorite-hover:hover {
  .del {
    display: block;
  }
}

::v-deep .el-icon-arrow-right:before {
  content: "\e6e0" !important;
}

::v-deep .iconf-maintain-weihu {
  color: #3366cc !important;
}

.xh-collapse-item {
  padding: 20px;
}

::v-deep .cb-collapse .el-collapse-item__header{
    padding-left: 10px;
}
</style>
