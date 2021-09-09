<template>
    <div class="page">
        <!-- 头部导航 -->
        <div class="header">
            <!--            <el-menu :default-active="activeIndex" class="k-menu" mode="horizontal" @select="handleSelect2">-->
            <!--            <el-menu class="k-menu" mode="horizontal">-->
            <!--                &lt;!&ndash;                <el-menu-item index="1">事前规则</el-menu-item>&ndash;&gt;-->
            <!--                <el-menu-item index="2">事后规则</el-menu-item>-->
            <!--            </el-menu>-->
            <div class="header2">
                <div class="l">
                    <el-input
                        size="mini"
                            class="x-input"
                            placeholder="请输入内容"
                            v-model="searchInput"
                    ></el-input>
                    <!--                    <el-button type="primary" icon="el-icon-search" @click="getSearchRes">搜索</el-button>-->
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search"
                    >搜索
                    </el-button
                    >
                    <!-- 先不要删，之后会用到该功能，后台暂时没有时间开发该功能，便于给用户演示 -->
                    <!-- <div class="xh-select">
                                  <el-select v-model="hospitalValue" placeholder="请选择" @change="sethospitalValue">
                                      <el-option v-for="item in hospitalList" :key="item.value" :label="item.value" :value="item.code"> </el-option>
                                  </el-select>
                              </div> -->
                </div>
                <div class="r">
                    <el-button size="mini"
                            type="primary"
                            icon="el-icon-s-operation"
                            @click="showZiDingYiQuJianJianCheDialog"
                    >自定义区间检测
                    </el-button
                    >
                    <!-- <el-button type="primary" icon="el-icon-s-data">自定义</el-button>
                    <el-button type="primary" icon="el-icon-upload">导入</el-button> -->
                </div>
            </div>
        </div>

        <!-- 主内容区 -->
        <!-- 表单数据 -->
        <div class="search-null" v-if="searchnull">没有找到需要的内容</div>
        <div class="main-data">
            <!--            <el-table :data="rules" stripe class="xh-table-border1" @cell-mouse-enter="setTableTime"-->
            <!--                      @cell-mouse-leave="postTableTime">-->
            <el-table :data="rules" stripe class="xh-table-border1">
                <el-table-column label="编码" width="50" type="index"></el-table-column>
                <el-table-column
                        label="规则属性"
                        width="100"
                        prop="category"
                ></el-table-column>
                <el-table-column
                        label="规则名称"
                        width="130"
                        prop="name"
                ></el-table-column>
                <el-table-column label="规则描述" prop="comment"></el-table-column>
                <!--                <el-table-column label="自定义检测区间" prop="" width="240">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <div class="table-picker" v-if="scope.row.id == hoverTdId">-->
                <!--                            <el-date-picker-->
                <!--                                @focus="setTableHoveId"-->
                <!--                                @change="changeTableHoveId"-->
                <!--                                @blur="blurTableHoveId"-->
                <!--                                size="mini"-->
                <!--                                :clearable="false"-->
                <!--                                v-model="date_picker_total"-->
                <!--                                value-format="yyyy-MM-dd"-->
                <!--                                type="daterange"-->
                <!--                                range-separator="至"-->
                <!--                                start-placeholder="开始日期"-->
                <!--                                end-placeholder="结束日期"-->
                <!--                            >-->
                <!--                            </el-date-picker>-->
                <!--                        </div>-->
                <!--                        <div v-else class="table-time-txt">-->
                <!--                            {{ scope.row.startTime | formatDateTable }} 至 {{ scope.row.endTime | formatDateTable }}-->
                <!--                        </div>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->

                <!--                <el-table-column label="增量检测区间" width="120" >-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <div class="act-day">-->
                <!--                            &lt;!&ndash; 修改天数 &ndash;&gt;-->
                <!--                            <div class="edit-day" v-if="scope.row.id == hoverIncrement">-->
                <!--                                <el-input-number-->
                <!--                                    @blur="blurIncrementDay"-->
                <!--                                    size="mini"-->
                <!--                                    v-model="scope.row.dateRange"-->
                <!--                                    controls-position="right"-->
                <!--                                    :min="1"-->
                <!--                                    :max="30"-->
                <!--                                ></el-input-number>-->
                <!--                            </div>-->

                <!--                            <span v-else>执行前 {{ scope.row.dateRange }} 天</span>-->
                <!--                        </div>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->

                <!--                <el-table-column label="创建时间" width="190" prop="createTime"></el-table-column>-->
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                icon="icon iconfont iconbianji"
                                @click="handleEdit(scope.$index, scope.row)"
                        ></el-button>
                        <!--                        <el-button-->
                        <!--                            size="mini"-->
                        <!--                            type="danger"-->
                        <!--                            icon="icon iconfont iconshanchu"-->
                        <!--                            @click="handleDelete(scope.$index, scope.row)"-->
                        <!--                        ></el-button>-->
                        <el-button
                                size="mini"
                                type="info"
                                icon="icon iconfont iconrizhi"
                                @click="queryHistory(scope.$index, scope.row)"
                        ></el-button>
                        <!--                        <el-button-->
                        <!--                            size="mini"-->
                        <!--                            type="info"-->
                        <!--                            icon="icon iconfont iconjiance"-->
                        <!--                            @click="showQuanLiang(scope.$index, scope.row)"-->
                        <!--                        ></el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 评分规则弹窗 -->
        <div>
            <el-dialog
                    :title="dialogTitle"
                    :visible.sync="standardDialog"
                    width="600px"
                    custom-class="k-dialog"
                    @closed="closeDialog"
            >
                <!-- 弹窗tab导航 -->
                <header class="xh-evaluation-criteria">
                    <el-menu
                            :default-active="flag"
                            class="el-menu-demo"
                            mode="horizontal"
                            @select="tagSelect"
                    >
                        <el-menu-item index="table">表评估</el-menu-item>
                        <el-menu-item index="source">源评估</el-menu-item>
                    </el-menu>
                </header>
                <!-- 表评估 -->
                <main v-show="flag === 'table'">
                    <el-row>
                        <el-col :span="6">
                            <div class="gtid-left">规则名称：</div>
                        </el-col>
                        <el-col :span="18">
                            <div class="grid-right">
                                <el-input v-model="name" placeholder="请输入内容"></el-input>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <div class="gtid-left">规则描述：</div>
                        </el-col>
                        <el-col :span="18">
                            <div class="grid-right">
                                <el-input v-model="comment" placeholder="请输入内容"></el-input>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="slider">
                        <el-col :span="6">
                            <div class="gtid-left">评估标准：</div>
                        </el-col>
                        <el-col :span="18">
                            <div class="grid-right">
                              <vue-slider v-model="values" tooltip="none" :process="process" :marks="marks" :min-range="5">
                                <template v-slot:process="{ start, end, style, index }">
                                  <div class="vue-slider-process" :style="style">
                                    <div :class="[
                                      'merge-tooltip',
                                      'tooltip'+index,
                                      'vue-slider-dot-tooltip-inner',
                                      'vue-slider-dot-tooltip-inner-top',
                                    ]">
                                      {{grades[index]}}：{{ values[index] }}-{{ values[index + 1] }}
                                    </div>
                                  </div>
                                </template>
                              </vue-slider>
                            </div>
                        </el-col>
                    </el-row>
                </main>
                <!-- 源评估 -->
                <main v-show="flag === 'source'">
                    <el-row>
                        <el-col :span="6">规则名称：</el-col>
                        <el-col :span="18">
                            <el-input v-model="name" :readonly="true"></el-input>
                        </el-col>
                    </el-row>
<!--                    <el-row>-->
<!--                        <el-col :span="6">规则描述：</el-col>-->
<!--                        <el-col :span="18">-->
<!--                            <el-input v-model="comment" placeholder="请输入描述内容"></el-input>-->
<!--                        </el-col>-->
<!--                    </el-row>-->
                    <el-row>
                        <el-col :span="6">不通过标准：</el-col>
                        <el-col :span="18" class="select-biaozun-box">
                            <!-- 选择：优、良、中、差 -->
                            <div class="select-type">
                                <el-select v-model="grade" placeholder="请选择">
                                    <el-option
                                            v-for="item in gradeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </div>
                            <!-- 选择大于、小于、等于 -->
                            <div class="select-fuhao">
                                <el-select v-model="operator" placeholder="请选择">
                                    <el-option
                                            v-for="item in operatorList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </div>
                            <!-- 输入数值 -->
                            <div class="select-nums">
                                <el-input
                                        :disabled="disablednums"
                                        v-model="value"
                                        placeholder="填写数值"
                                        type="number"
                                ></el-input>
                            </div>
                            <div class="add-select">
                                <el-button @click="addCondition">
                                    <i class="el-icon-plus"></i>
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6"></el-col>
                        <el-col :span="18">
                            <!-- 已经设置的标签，循环显示，无：不显示任何信息 -->
                            <el-tag
                                    v-for="tag in condition"
                                    :key="tag.id"
                                    closable
                                    @close="delCondition(tag)"
                            >
                                {{ tag.comment }}
                            </el-tag>
                        </el-col>
                    </el-row>
                </main>
                <span slot="footer" class="dialog-footer">
          <el-button type="default" @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="saveRule">确 定</el-button>
        </span>
            </el-dialog>
        </div>

        <!-- 历史记录弹窗 -->
        <el-dialog
                title="质量评估标准历史记录"
                :visible.sync="historyDialog"
                width="480"
        >
            <div class="timeline mar-top-10">
                <el-timeline>
                    <template v-for="(item, index) in history">
                        <el-timeline-item
                                :timestamp="item.createTime | time"
                                placement="top"
                                :key="index"
                        >
                            <el-card>
                                <h4 v-if="item.status === 1">
                                    规则名称：{{ item.name }}（已启用）
                                </h4>
                                <h4 v-if="item.status === 0">
                                    规则名称：{{ item.name }}（已停用）
                                </h4>
                                <p>规则描述：{{ item.desc }}</p>
                                <p>
                                    评估标准：
                                    <el-tag
                                            v-for="(item2, index2) in item.condition"
                                            :key="index2"
                                    >
                                        {{ item2.desc }}
                                    </el-tag>
                                </p>
                            </el-card>
                        </el-timeline-item>
                    </template>
                </el-timeline>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="historyDialog = false">关闭</el-button>
                <!--                <el-button @click="dialogRizi = false">取 消</el-button>-->
                <!--                <el-button type="primary" @click="dialogRizi = false">确 定</el-button>-->
      </span>
        </el-dialog>

        <!-- 弹窗--源目全量检测 -->
        <!--        <el-dialog title="全量检测" :visible.sync="YMQLJC_Dialog" width="900px" custom-class="k-dialog xh-ymqljc-dialog">-->
        <!--            &lt;!&ndash; 头部搜索框 &ndash;&gt;-->
        <!--            <div class="ymqljc-top">-->
        <!--                <el-input v-model="ymqljc_search" placeholder="请输入关键字查询" class="ymqljc-search"></el-input>-->
        <!--                <el-button type="primary" @click="setYMQLJCSearchRes">查询</el-button>-->

        <!--                <el-date-picker-->
        <!--                        v-model="runtime"-->
        <!--                        type="date"-->
        <!--                        size="mini"-->
        <!--                        value-format='yyyy-MM-dd'-->
        <!--                        placeholder="执行时间">-->
        <!--                </el-date-picker>-->
        <!--            </div>-->

        <!--            &lt;!&ndash; 全量数据表格 &ndash;&gt;-->
        <!--            <el-table :data="ymqljc_table_data" stripe height="400" @selection-change="getSelectRuleField" style="width: 100%">-->
        <!--                <el-table-column type="selection" width="55" :selectable="isSelecRuleTable"></el-table-column>-->
        <!--                <el-table-column type="index" label="序"></el-table-column>-->
        <!--                <el-table-column prop="tableName" show-overflow-tooltip label="目标表"></el-table-column>-->
        <!--                <el-table-column prop="desc" show-overflow-tooltip label="表中文名"></el-table-column>-->
        <!--                <el-table-column prop="type" show-overflow-tooltip label="所属源" width="70"></el-table-column>-->
        <!--                <el-table-column prop="hospitalName" show-overflow-tooltip label="机构名称"></el-table-column>-->
        <!--                <el-table-column label="区间值" width="240">-->
        <!--                    <template slot-scope="scope"> -->
        <!--                        <div v-if="scope.row.status === '1'">-->
        <!--                            {{ scope.row.startTimeStr }} 至 {{ scope.row.endTimeStr }}-->
        <!--                        </div>-->

        <!--                        <div v-else class="quanlian-picker-date">-->
        <!--                            <el-date-picker-->
        <!--                                @change='setQLQJDate(scope.row)'-->
        <!--                                v-model="scope.row.timeRange"-->
        <!--                                type="daterange"-->
        <!--                                size="mini"-->
        <!--                                value-format='yyyy-MM-dd'-->
        <!--                                range-separator="至"-->
        <!--                                start-placeholder="开始日期"-->
        <!--                                end-placeholder="结束日期">-->
        <!--                            </el-date-picker>-->
        <!--                        </div>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
        <!--                <el-table-column label="状态" width="80">-->
        <!--                    <template slot-scope="scope">-->
        <!--                        <span :class="{'span-yxz1':scope.row.status === '1',  'span-yxz2':scope.row.status === '2' }">-->
        <!--                        {{ scope.row.status === '1' ? '运行中' : '未运行' }}-->
        <!--                        </span>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
        <!--            </el-table>-->

        <!--            &lt;!&ndash; 分页 &ndash;&gt;-->
        <!--            <div class="fenye">-->
        <!--                <el-pagination-->
        <!--                    hide-on-single-page-->
        <!--                    @current-change="currentChange"-->
        <!--                    background-->
        <!--                    layout="prev, pager, next,total,jumper"-->
        <!--                    :total="ymqljc_data_total"-->
        <!--                >-->
        <!--                </el-pagination>-->
        <!--                <el-button  plain size="mini" v-if="ymqljc_data_total.length > 0">确定</el-button>-->
        <!--            </div>-->

        <!--            &lt;!&ndash; 底部操作按钮 &ndash;&gt;-->
        <!--            <span slot="footer" class="dialog-footer">-->
        <!--                <el-button @click="YMQLJC_Dialog = false">取 消</el-button>-->
        <!--                <el-button type="primary" @click="implementRule">执行</el-button>-->
        <!--                <el-button type="primary" @click="cancel">撤回</el-button>-->
        <!--            </span>-->
        <!--        </el-dialog>-->

        <!-- 自定义区间检测弹窗 -->
        <el-dialog
                class="k-dialog "
                title="自定义区间检测"
                :visible.sync="ziDingYiQuJianJianCheDialog"
                width="70%"
                :close-on-click-modal="false"
        >
            <qujianjiance @zhi-xing="zhiXing" v-if="ziDingYiQuJianJianCheDialog"/>
        </el-dialog>
    </div>
</template>
<script>
// let isSetDate = false, // 阻止选择日期时，td改变
//     temporaryDay = 1; // 用来临时记录td中的天数，用来比较。
// import xh from './js/xh.js';

import qujianjiance from "../components/dialogZiDingYiQuJianJianChe";

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
    filters: {
        time: function time(value) {
            if (!value) {
                return "日期获取失败";
            }
            let d = new Date(value);
            return (
                d.getFullYear() +
                "-" +
                (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) +
                "-" +
                (d.getDate() > 9 ? d.getDate() : "0" + d.getDate()) +
                " " +
                (d.getHours() > 9 ? d.getHours() : "0" + d.getHours()) +
                "-" +
                (d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes()) +
                "-" +
                (d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds())
            );
        },

        // 格式化全量时间区间的日期格式
        formatDateTable(val) {
            if (!val) {
                return;
            }
            if (val.length > 10) {
                return val.split(" ")[0];
            }
        },
    },

    data() {
        return {
            ziDingYiQuJianJianCheDialog: false,
            // 事前规则列表
            rules: [],
            // 规则id
            id: "",
            // 规则名称
            name: "",
            // 规则备注
            comment: "",
            // 判定条件
            condition: [],
            // 优良中差
            grade: "",
            // 判断操作符
            operator: "",
            // 判断值
            value: "",
            // 优
            a: [0, 100],
            // 良
            b: [0, 80],
            // 中
            c: [0, 60],
            // 差
            d: [0, 40],

            values: [0, 40,60,80, 100],
            marks: [0,50, 100],
            process: val => [
              [val[0], val[1], { backgroundColor: '#d38545' }],
              [val[1], val[2], { backgroundColor: '#e4b617' }],
              [val[2], val[3], { backgroundColor: '#21aced' }],
              [val[3], val[4], { backgroundColor: '#08c397' }],
            ],
            grades:["差","中","良","优"],

            // 评级
            gradeList: [
                {value: "A", label: "优"},
                {value: "B", label: "良"},
                {value: "C", label: "中"},
                {value: "D", label: "差"},
            ],
            // 操作符
            operatorList: [
                {value: ">", label: "大于"},
                {value: "<", label: "小于"},
                {value: ">=", label: "大于等于"},
                {value: "<=", label: "小于等于"},
            ],

            // 评分标准dialog
            standardDialog: false,
            // 评估标准tag：1源评估,0表评估
            flag: "source",
            // 历史日志dialog
            historyDialog: false,
            // 历史日志数据
            history: [],

            checkRule: "",

            runtime: "", //执行时间
            fullexec_rule: "",
            hospitalList: [],
            hospitalValue: "HID0101",
            fullexec_table: [],
            fullexec_hospital: "HID0101",
            fullexec_type: "",
            ymqljc_data_total: 0,
            ymqljc_search: "",
            YMQLJC_Dialog: false,
            date_picker_total: [],
            TotalQuantityId: 0,
            TotalQuantityDay: 0,
            ymqljc_table_data: [],
            hoverTdId: -1,
            hoverIncrement: -1,
            disablednums: false,
            // 历史日志记录
            dialogRizi: false,
            rizidata: [],
            // 默认高亮显示tap；1、事前规则；2、事后规则
            // activeIndex: '2',
            // 搜索input
            searchInput: "",
            // 如果没有搜索结果显示
            searchnull: false,
            // 类别数据
            typelist: [],
        };
    },
    components: {
        qujianjiance,
        VueSlider
    },
    // 创建元素前
    created() {
        this.queryAfterRule();
    },
    // 创建元素后
    mounted() {
    },

    // 计算属性
    computed: {
        // 弹窗标题
        dialogTitle: function () {
            return this.name + "评估标准";
        },
    },

    // 方法
    methods: {
        //   自定义区间检测子组件传入的事件
        zhiXing() {
            this.ziDingYiQuJianJianCheDialog = false;
        },
        showZiDingYiQuJianJianCheDialog() {
            this.ziDingYiQuJianJianCheDialog = true;
        },
        /**
         * 顶部搜索
         */
        search() {
            this.$R
                .queryAfter({
                    keyword: this.searchInput,
                })
                .then((data) => {
                    this.rules = data;
                });
        },
        /**
         * 查询事后规则
         */
        queryAfterRule() {
            this.$R.queryAfter({}).then((data) => {
                this.rules = data;
            });
        },
        /**
         * 编辑
         */
        handleEdit(index, row) {
            this.id = row.id;
            this.checkRule = row.code;
            this.getRuleInfo(row.code);
        },
        getRuleInfo(rule) {
            let that = this;
            that.$R
                .getAfterStandard({
                    rule: rule,
                })
                .then((data) => {
                    that.name = data.name;
                    that.comment = data.comment;
                    that.condition = data.condition;
                    that.a = [data.b, 100]; // [良,100]
                    that.b = [data.c, data.b]; // [中,良)
                    that.c = [data.d, data.c]; // [差,中)
                    that.d = [0, data.d]; // [0,差)
                    that.values = [0,data.d,data.c,data.b,data.a]
                    that.standardDialog = true;
                });
        },
        /**
         * 历史变更记录
         */
        queryHistory(index, row) {
            let that = this;
            that.historyDialog = true;
            that.$R
                .history({
                    id: row.id,
                })
                .then((data) => {
                    that.history = data;
                });
        },
        /**
         * 添加判定条件
         */
        addCondition() {
            let that = this;

            let gradeDict = {A: "优", B: "良", C: "中", D: "差"};
            let operatorDict = {
                ">": "大于",
                ">=": "大于等于",
                "<": "小于",
                "<=": "小于等于",
            };

            if (that.grade === "" || that.operator === "" || that.value === "") {
                this.$message.warning("请检查判定条件");
                return;
            }

            // xx的个数大于等于多少个...
            let comment =
                gradeDict[that.grade] +
                "的个数" +
                operatorDict[that.operator] +
                that.value +
                "个";

            // 判定条件不可重复 todo 相悖的条件判断
            let flag = true;
            that.condition.forEach((n) => {
                if (n.comment === comment) {
                    this.$message.warning("该判定条件已经存在");
                    flag = false;
                }
            });

            // 添加
            if (flag) {
                that.condition.push({
                    mdm_rule_id: that.id,
                    grade: that.grade,
                    operator: that.operator,
                    value: that.value,
                    comment: comment,
                });
            }
        },
        /**
         * 删除判定条件
         */
        delCondition(tag) {
            // 删除数组
            this.condition.splice(this.condition.indexOf(tag), 1);
        },
        /**
         * 切换tab
         */
        tagSelect(key) {
            this.flag = key;
        },
        /**
         * 关闭dialog
         */
        closeDialog() {
            this.standardDialog = false;
        },
        /**
         * 保存数据
         */
        async saveRule() {
            // 获取要请求的参数
            let param = {
                id: this.id,
                condition: this.condition,
                name: this.name,
                comment: this.desc,
                a: this.values[4],
                b: this.values[3],
                c: this.values[2],
                d: this.values[1],
            };

            // 请求数据
            let res = await this.$R.modifyAfterStandard(param);
            //  隐藏弹窗
            this.standardDialog = false;
            //  保存数据成功提示
            this.$message({
                message: "数据保存成功",
                type: "success",
            });
        },


        // 获取焦点
        focusIncrementDay() {
            console.log("获取焦点");
        },

        // 失去焦点
        blurIncrementDay() {
            console.log("失去焦点");
        }

    },

    // 侦听属性
    watch: {},
};
</script>

<style lang="scss" scoped>
.select-biaozun-box {
  display: flex;
}

.page {
  background: #fff;
  height: 100%;
}

.header {
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

.header2 {
  display: flex;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
}

::v-deep .el-dialog__body {
  padding-top: 0;
}

::v-deep .el-menu--horizontal > .el-menu-item {
  height: 30px;
  line-height: 30px;
}

.ymqljc-top {
  display: flex;
  margin: 10px 0;

  .ymqljc-search {
    width: 150px;
    margin-right: 10px;
  }
}

.l {
  display: flex;
  justify-content: flex-start;
  padding-left: 10px;
  align-items: center;

  .x-input {
    width: 200px;
  }
}

.x-input.el-input {
  margin-right: 10px;
}

.main-data {
  padding: 0 10px;

  ::v-deep .el-table--small td {
    padding: 0;
    height: 30px;
  }

  ::v-deep .el-table--small th {
    padding: 0;
    height: 40px;
  }

  ::v-deep .el-table tbody tr:hover > td {
    background-color: #c5e3ff !important;
  }

  .el-button + .el-button {
    margin-left: 0;
  }

  .el-button--mini,
  .el-button--mini.is-round {
    padding: 0 5px;
  }

  .el-button--primary {
    font-size: 16px;
    background: none;
    border: none;
    color: #1890ff;
  }

  .el-button--danger {
    font-size: 16px;
    background: none;
    border: none;
    color: #eb6363;
  }

  .el-button--info {
    font-size: 16px;
    background: none;
    border: none;
    color: #fc8f37;
  }
}

.data-fenye {
  padding-right: 20px;
  text-align: right;

  ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #36c;
  }

  ::v-deep .el-pagination.is-background .btn-next,
  ::v-deep .el-pagination.is-background .btn-prev,
  ::v-deep .el-pagination.is-background .el-pager li {
    border-radius: 0;
  }
}

.fenye {
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
}

.block {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-slider {
    width: 30px;
  }

  .el-slider {
    flex: 1;
  }
}

.el-row {
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.select-type,
.select-fuhao {
  margin-right: 2px;
}

.select-nums {
  margin-right: 10px;
}

::v-deep .el-tag {
  margin-right: 10px;
}

.table-time-txt {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.xh-select {
  margin-left: 20px;
}

.el-slider-val {
  margin-left: 20px;
}

::v-deep .edit-day {
  .el-input-number--mini {
    width: 100%;
  }

  .el-input-number--mini .el-input__inner {
    padding: 0;
  }

  .el-input-number .el-input__inner {
    padding: 0;
    text-align: center;
  }

  .el-input-number.is-controls-right .el-input__inner {
    padding: 0;
  }
}

.span-yxz1 {
  color: #ec6c6c;
}

.span-yxz2 {
  color: #00b865;
}

::v-deep .quanlian-picker-date {
  width: 100%;

  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 100%;
    background: #fff;
  }
}

.xh-evaluation-criteria {
  margin-bottom: 20px;
}

.slider {
  margin: 45px 0!important;
    .merge-tooltip {
      position: absolute;
      left: 50%;
      bottom: 100%;
      transform: translate(-50%, -15px);
    }
    .tooltip0{
      background: #d38545;
      &::after{
        border-top-color: #d38545;
      }
    }
    .tooltip1 {
      background: #e4b617;
       &::after{
        border-top-color: #e4b617;
      }
    }
    .tooltip2 {
      background: #21aced;
       &::after{
        border-top-color: #21aced;
      }
    }
    .tooltip3 {
      background: #08c397;
       &::after{
        border-top-color: #08c397;
      }
    }
}
</style>
