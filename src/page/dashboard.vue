<template>
    <div class="app xh-dashboard-page">
        <div class="header">
            <el-row type="flex" style="width: 100%">
                <el-col :span="12">
                    <div>
                        <span class="title">日审分析</span>
                    </div>
                </el-col>
                <el-col :offset="10" :span="12" class="right-select">
                    <div class="hospital mar-r-10">
                        <el-select
                                v-model="hospital"
                                placeholder="请选择医院"
                                @change="queryBar"
                        >
                            <el-option
                                    v-for="item in hospitalList"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="riqi">
                        <el-date-picker
                                v-model="date"
                                value-format="yyyy-MM-dd"
                                type="date"
                                class="riqi-style"
                                @change="queryBar"
                        ></el-date-picker>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- BAR -->
        <div class="tubiao box">
            <div id="echart"></div>
            <div class="echart-title">当日数据质量评估</div>
        </div>

        <!-- 表单数据 -->
        <el-row :gutter="10">
            <el-col :span="9">
                <div class="box table1">
                    <div class="table-title">质量结果-{{ rule.name }}</div>
                    <div class="tips">
                        <p>
                            质量结果：
                            <span class="a">{{ table1.pass ? '通过' : '不通过' }}</span>
                        </p>
                        <p>触犯规则：{{ table1.cause }}</p>
                    </div>
                    <div class="eltable"></div>
                    <el-table
                            :data="table1.list"
                            border
                            :cell-class-name="tdclass"
                            class="tableData1"
                            style="width: 100%;"
                    >
                        <el-table-column prop="adesc" label="优"></el-table-column>
                        <el-table-column prop="bdesc" label="良"></el-table-column>
                        <el-table-column prop="cdesc" label="中"></el-table-column>
                        <el-table-column prop="ddesc" label="差"></el-table-column>
                        <el-table-column prop="total" label="检测总数">
                            <template slot-scope="scope">
                                <!-- <div @click="">{{ scope.row.total }}</div> -->
                                <div>{{ scope.row.total }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="box table2">
                    <div class="table-title title-bottom-10">数据接入汇总</div>
                    <el-table
                            :data="table2"
                            border
                            :cell-class-name="iconClassTd"
                            class="tableData1"
                            style="width: 100%"
                    >
                        <el-table-column prop="rule" label="规则" :fixed="true">
                        </el-table-column>
                        <template v-for="item in dbList">
                            <el-table-column
                                    :prop="item"
                                    :label="item"
                                    :key="item"
                            ></el-table-column>
                        </template>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="15">
                <div class="box table3">
                    <div class="table-title title-bottom-10">
                        明细情况-{{ rule.name }}
                    </div>
                    <el-table :data="table3" stripe border>
                        <el-table-column
                                type="index"
                                width="50"
                                label="序"
                        ></el-table-column>
                        <el-table-column
                                v-for="(item, index) in showHeader"
                                :key="index"
                                :prop="item.prop"
                                :label="item.label"
                                show-overflow-tooltip
                        ></el-table-column>
                    </el-table>
                    <div class="data-fenye">
                        <el-pagination
                                hide-on-single-page
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                background
                                :current-page.sync="current"
                                :page-size.sync="size"
                                layout="prev, pager, next, jumper"
                                :total="total"
                        ></el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import settings from '@/settings'
import { formatDate } from './js/format.js';
export default {
    data() {
        return {
            // 核查业务时间
            date: '',
            // 医联体
            hospital: '',
            // 库
            model: '',
            // 规则
            rule: '',

            // 全部柱状图数据，{库：[...]...}
            barData: [],
            // 当前显示的柱状图数据
            barShowData: null,
            // 是否自动播放
            autoplay: false,

            // 质量结果表数据全部数据
            ruleResultList: {},
            // 质量结果表
            table1: {},
            // 结果汇总表
            table2: [],

            // 分页
            current: 0,
            size: 10,
            total: 0,

            // 表3的标题维护
            headerList: {
                source_target: [
                    {prop: 'model', label: '模型'},
                    {prop: 'tableNameCN', label: '表'},
                    // {prop: 'hospital', label: '机构'},
                    {prop: 'score', label: '分数'},
                    {prop: 'targetTotal', label: '目标表数据总量'},
                    {prop: 'targetMore', label: '目标表差异量'},
                    {prop: 'sourceTotal', label: '源表数据总量'},
                    {prop: 'sourceMore', label: '源表差异量'}
                ],
                main_detail: [
                    {prop: 'model', label: '模型'},
                    {prop: 'tableNameCN', label: '表'},
                    // {prop: 'hospital', label: '机构'},
                    {prop: 'score', label: '分数'},
                    {prop: 'total', label: '子表数据量'},
                    {prop: 'match', label: '匹配数据量'}
                ],
                non_empty: [
                    {prop: 'model', label: '模型'},
                    {prop: 'tableNameCN', label: '表'},
                    // {prop: 'hospital', label: '机构'},
                    {prop: 'score', label: '分数'},
                    {prop: 'checkFieldCount', label: '核查字段数'},
                    {prop: 'fillRate02FieldsNumber', label: '填充率在0~20%的字段数'},
                    {prop: 'fillRate24FieldsNumber', label: '填充率在20~40%的字段数'},
                    {prop: 'fillRate46FieldsNumber', label: '填充率在40~60%的字段数'},
                    {prop: 'fillRate68FieldsNumber', label: '填充率在60~80%的字段数'},
                    {prop: 'fillRate810FieldsNumber', label: '填充率在80~100%的字段数'}
                ],
                abs: [
                    {prop: 'model', label: '模型'},
                    {prop: 'tableNameCN', label: '表'},
                    // {prop: 'hospital', label: '机构'},
                    {prop: 'score', label: '分数'},
                    {prop: 'field', label: '绝对值字段'},
                    {prop: 'total', label: '数据总量'},
                    {prop: 'detection', label: '检测记录数'},
                    {prop: 'satisfied', label: '满足条件记录数'},
                    {prop: 'unsatisfied', label: '不满足条件记录数'}
                ],
                enum: [
                    {prop: 'model', label: '模型'},
                    {prop: 'tableNameCN', label: '表'},
                    // {prop: 'hospital', label: '机构'},
                    {prop: 'score', label: '分数'},
                    {prop: 'field', label: '枚举值字段'},
                    {prop: 'total', label: '数据总量'},
                    {prop: 'detection', label: '检测记录数'},
                    {prop: 'satisfied', label: '满足条件记录数'},
                    {prop: 'unsatisfied', label: '不满足条件记录数'}
                ],
                row: [
                    {prop: 'model', label: '模型'},
                    {prop: 'tableNameCN', label: '表'},
                    // {prop: 'hospital', label: '机构'},
                    {prop: 'score', label: '分数'}
                ]
            },
            // 表3当前显示的标题
            showHeader: [],
            // 明细情况
            table3: [],

            // 码表：规则类型 xAxis
            ruleList: [],
            // 码表：库名，时间轴
            dbList: [],
            // 码表：优良中差：ABCD
            gradeList: [],
            // 码表：医联体
            hospitalList: [],
            // 任务类型
            jobList: [],
            intervalDays: settings.intervalDays || 0
        };
    },
    created() {
        this.getDateYMD()
    },
    async mounted() {
        await this.queryDict();
        await this.queryBar();
    },
    methods: {

        getDateYMD() {
            this.date = formatDate(new Date(new Date().getTime() + this.intervalDays * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
        },
        /**
         * 分页
         */
        handleSizeChange() {
            this.refreshTable3();
        },
        handleCurrentChange() {
            this.refreshTable3();
        },
        /**
         * 查询字典表
         */
        async queryDict() {
            await this.$R
                    .queryDict({
                        types: 'dept,rule,job'
                    })
                    .then((data) => {
                        this.hospitalList = data.dept;
                        this.hospital = this.hospitalList[0].code;
                        // this.ruleList = data.rule;
                        data.rule.forEach((item)=>{
                          // 隐藏行数规则
                          if(item.code!=='row'){
                            this.ruleList.push(item);
                          }
                        })
                        this.rule = this.ruleList[0];
                        // this.jobtList = data.job;
                    });
        },
        /**
         * 查询echarts柱状图数据
         */
        async queryBar() {
            this.$R
                    .incrementAnalysis({
                        dept: this.hospital,
                        date: this.date
                    })
                    .then((res) => {
                        // 初始化echarts
                        let barData = [];
                        let dbList = [];
                        res.echartsData.forEach((n) => {
                            let bar = {
                                series: [
                                    {data: n.a},
                                    {data: n.b},
                                    {data: n.c},
                                    {data: n.d}
                                ]
                            };
                            barData.push(bar);
                            dbList.push(n.model);
                        });
                        this.barData = barData;
                        this.dbList = dbList;
                        this.model = this.dbList[0];
                        this.initEcharts();

                        // 质量结果表数据
                        let ruleResultList = {};
                        res.summaryData.forEach((foo) => {
                            if (ruleResultList[foo.model] === undefined) {
                                ruleResultList[foo.model] = {};
                            }
                            foo.rule.forEach((bar) => {
                                ruleResultList[foo.model][bar.rule] = bar;
                                ruleResultList[foo.model][bar.rule].list = [bar];
                            });
                        });
                        this.ruleResultList = ruleResultList;
                        this.table1 = ruleResultList[this.model][this.rule.code];

                        // 结果汇总表数据
                        this.table2 = [];
                        // 结果汇总表数据
                        this.ruleList.forEach((rule) => {
                            let row = {};
                            // 第一列是规则
                            row['rule'] = rule.name;
                            // 第二列开始是数据源pass
                            Object.keys(this.ruleResultList).forEach((db) => {
                                row[db] = this.ruleResultList[db][rule.code] ? this.ruleResultList[db][rule.code].pass : false;
                            });
                            this.table2.push(row);
                        });
                        this.showHeader = this.headerList[this.rule.code];
                        // 详情表
                        this.refreshTable3();
                    });
        },
        /**
         * 查询table3
         */
        refreshTable3() {
            this.showHeader = this.headerList[this.rule.code];
            this.$R
                    .incrementDetail({
                        rule: this.rule.code,
                        dept: this.hospital,
                        model: this.model,
                        date: this.date,
                        current: this.current,
                        size: this.size
                    })
                    .then((data) => {
                        this.table3 = data.records;
                        this.size = data.size;
                        this.current = data.current;
                        this.total = data.total;
                    });
        },
        // 左边表2根据内容返回对应的图表
        iconClassTd({row, column, rowIndex, columnIndex}) {
            // 表格的值
            let itemval = this.table2[rowIndex][column.property];
            // 默认高亮第一个元素
            if (rowIndex === 0 && columnIndex === 1) {
                if (itemval === true) {
                    return (
                            'tableicon1 icon iconfont icondui gaoliang' +
                            ' cd' +
                            rowIndex +
                            columnIndex
                    );
                }
                if (itemval === false) {
                    return (
                            'tableicon2 icon iconfont iconwrong gaoliang' +
                            ' cd' +
                            rowIndex +
                            columnIndex
                    );
                }
            }
            // return 'tableicon1 icon iconfont'
            if (itemval === true) {
                return (
                        'tableicon1 icon iconfont icondui' + ' cd' + rowIndex + columnIndex
                );
            }
            if (itemval === false) {
                return (
                        'tableicon2 icon iconfont iconwrong' + ' cd' + rowIndex + columnIndex
                );
            }
            return ' cd' + rowIndex + columnIndex;
        },

        /**
         * 刷新table1
         */
        refreshTable1() {
            this.table1 = this.ruleResultList[this.model][this.rule.code];
        },
        /**
         * 刷新table2
         */
        refreshTable2() {
            let that = this;
            // 移除当前高亮
            document
                    .getElementsByClassName('gaoliang')[0]
                    .classList.remove('gaoliang');
            // 设置新高亮元素
            let row = this.ruleList.findIndex(function (item) {
                return item === that.rule;
            });
            let col =
                    this.dbList.findIndex(function (item) {
                        return item === that.model;
                    }) + 1;
            document
                    .getElementsByClassName('cd' + row + col)[0]
                    .classList.add('gaoliang');
        },
        /**
         * table1的td字体颜色
         */
        tdclass(obj) {
            // 根据表格的下标返回对应的class
            return 'tdclass' + obj.columnIndex;
        },
        /**
         * 质量结果高亮
         */
        zhiLiangGaoLiang({row, column, rowIndex, columnIndex}) {
            let ZhiLiangJieGuo = this.tableData3[rowIndex][column.property];
            if (ZhiLiangJieGuo === '优') {
                return 'class-zljg-you';
            }
            if (ZhiLiangJieGuo === '良') {
                return 'class-zljg-liang';
            }
            if (ZhiLiangJieGuo === '中') {
                return 'class-zljg-zhong';
            }
            if (ZhiLiangJieGuo === '差') {
                return 'class-zljg-cha';
            }
        },

        /**
         * 创建图表
         */
        initEcharts() {
            let that = this;
            // 获取创建chart的dom
            this.myChart = this.$echarts.init(document.getElementById('echart'));

            // 默认图标;img1 默认图标，img2：长条图标；prevIcon 前；nextIcon：后
            let img1 =
                    'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAABFUlEQVQokY3SvyuFURzH8dd9kBCDsjz8ATaTUpKexfKMJouyyKDYUIYr2S3+A7PtDpRu+QskVpPuYDBI5MeNvjqPCfd+6ts5nfN5dz59v6dWr9dVajRbPehNVcMnPqLKIm9XvrgMcxj6MIBJbGAeY7jHWaPZOsBtWeSfWYIDGMEizrGEPJ2PYwWXKMNcm55fjUjDmIpHMeRvPYcvSxHDuN4BCA1iq4L6MdcBqLSQpS5FxNEuoYkstTXa+dAldJelObziokvotIKecIS3LqDnLE36BTdYw/s/wHFZ5JvVcMP4iBPM4voX4BDLsfn+RvE1Ilqj2YpXrzCDXWwnoF4W+V5Ff0OVUtSoaMxOo9mKtV0W+f6PCV/2pUTv4I/aogAAAABJRU5ErkJggg==';
            let img2 =
                    'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAOCAYAAADNNOXMAAACH0lEQVRoge2ZzWsTQRjGn3dml5DGfhGr1Rw0p3qRXgoWLAi9qRcxIn6A0qp4KdjiQeqhRKTqUfFkoXrQg4fQWz0o/g8i9SZWRTAUlkotoUl39pUJG1LbbMlB0qk7Pxh2WWbYZx+endl3lvL5POJOhAcSgBM2AsAA/LCpRgOsl3UcU4QYhA6RCyCZHnlwJDWUuyX2dJ0gIXvAwRKvV976y8XpH2MDX8KwWRogrClb0KHq6J2ay3WcuvFedu69SNI5CCIXQmYokRxx9x/+cOjlt9OG6TYKyha8uHuAxXPp2qle/tq7L0z2d52dmIeQqchBzCX12+v/Ptr3uXbJelnHzlh/oz8NUu3Dl8e2DZWGqE2kOu+0XuLuQM9YJwHMAjgQdzO4XIL6tQSZzoAct4kBrAPWCmm7iZ8Aruk39DmA3ri7gWpOGBwEINlkTWND1Qg9Qc2KsAqyVHNCICHAym/ODrZFYRQ6WKMAimbKazFCgtwEeG21ufty8P88+79DZ+m6nvPfxP37qmFVmLv9rrrFsD1PAIzXxtuqsI5zdeGpKVp2jA375XpHvbT8+uGnRN+xm8mjQ8+AiHAF6hWEHN94yXpZx243bGUdwErx3pm5lfmZ41xZW9jcg5X/ePH8visGaDUWG6xNZAseZwteBcCq9+Lux6+XMoNcLj2q9WLl50k6E7qfKZpNxP4rjCBb8FS4NJYBTIZHRdK5b6RgkwDwB8XtlI+3EWx8AAAAAElFTkSuQmCC';
            let prevIcon =
                    'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABk0lEQVQ4jZWUzysEYRjHP8teN3/BUlpZObDt+rEu2G1zw0FDUm5+lTZEuKzb5ubm6MAJF+VEtEjJRZGW1lLsEjaRUlzo2Wa0TTOzu9+apne+3+cz7/vO+4zNHxzDQAGgV72Xq/Y9sA+sA3v6Ertu7AaWgTYDuEu9hoAYMApcaWZJTrAVODWB6NWmZlv1IJnJFuAoAKLJoda4NZANWAHKioBoKlNrbQIKAs1W6Wafm+lwj6ktDAEpVpAmXzXjw50cHl9YxRS7+okN5fNUER7pJhJdJZF8tAIFZEZOI8db72KwP0QkupYPInIK6NvImZ/qYy92RiKZzgfJSkCGr1uIrhFq91BbU1EIJ1XqrGxoBOr0zsvrOw/pDLMTCteJFK+ZDyvQtoC+gAEjV2A3t4/MTSo8Pb+RSmfMQDOytB3gxCxxfnnH4tIGHUGvWURqd7Xud6sPij3dsl4/ENd6Tbq4C/gsAiJZqYnLILf7DwDZeNNl5kgykpWarPT/I5lZCxACpLmkD+XA/gAPwBGwKXsC/P5XAX8exWTuUeAsggAAAABJRU5ErkJggg==';
            let nextIcon =
                    'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABmklEQVQ4jZWUSyhEURzGfzNkI4/sJIqhxmpKeceIFKWhiFKykaIUpTw2srCiWChlIQtESchGHrGRxisrz4XGkGcaJMOCDueK27kXX51u9/y/73f7n3PusaTn1aNQHlAO5AIxsuwBloEJ+fyhQN27HRgAchTweDlqgRWgDtjXitZvRifgNoDolSO9Tj0oEZgBQv4A0RQiM3YNZAGGgLB/QDSFyazFKhc2TeVqrCshN9vxGyxdMAKi45LbgCSV49n/Sn1NEde3PjzeazOYX4B6gQhV9eLqjo2dQ1qbKj5hp1dGoHAB6gYCjBz3D09s7x5TW13Ine8R79mNyhZsVc3qdeK5ZGpujeaGUiPLiwB5fwMl2KIoc2XS1TNuZDkXoDUziC02ko6WSobHFj9aNJBbgEaNqkkOG53tVfQNTOPeOjD73ogAzQPrqmpRQSr9g7Ns7hyZQUR2Qfv7E+VEqFlCIZ88zPvaru0BLuDhHxDhLdZugO/bvwqkGLWpaEd4ReZD+vtI0DOAfKAMyAKigSDgFFgCJsWaAG9fKeAdeyVrotMnFMQAAAAASUVORK5CYII=';

            let option = {
                baseOption: {
                    // 柱形图使用渐变色
                    color: [
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#53d1b3' // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#08c397' // 100% 处的颜色
                                }
                            ],
                            global: false // 缺省为 false
                        },
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#57beee' // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#21aced' // 100% 处的颜色
                                }
                            ],
                            global: false // 缺省为 false
                        },
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#e9cb63' // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#e4b617' // 100% 处的颜色
                                }
                            ],
                            global: false // 缺省为 false
                        },
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#efa365' // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#d38545' // 100% 处的颜色
                                }
                            ],
                            global: false // 缺省为 false
                        }
                    ],
                    timeline: {
                        // padding: [0, 200, 0, 200],
                        left: 200,
                        right: 200,
                        currentIndex: 0,
                        bottom: 15,
                        symbol: img1, // 默认图标
                        symbolSize: [13, 14], // 默认图标大小
                        // 当前项的样式
                        checkpointStyle: {
                            symbol: img2,
                            symbolSize: [150, 14]
                        },

                        controlStyle: {
                            show: this.dbList && this.dbList.length > 1,
                            //  prevIcon:prevIcon,
                            color: '#2492c5',
                            borderColor: '#2492c5',
                            itemGap: 70,
                            itemSize: 18
                        },
                        emphasis: {
                            label: {
                                show: true,
                                color: '#21aced'
                            }
                        },

                        lineStyle: {
                            show: true,
                            color: '#2b355f',
                            width: 4,
                            shadowBlur: 6,
                            shadowColor: '#262f54'
                        },
                        label: {
                            color: '#ededed',
                            fontSize: 12
                        },
                        axisType: 'category',
                        autoPlay: that.autoplay,
                        playInterval: 1500,
                        // data: ['DC', 'CDR', 'RDR']
                        // 获取请求的时间抽数据
                        data: this.dbList
                    },
                    tooltip: {},
                    legend: {
                        right: '15',
                        top: '15',
                        data: ['优', '良', '中', '差'],
                        textStyle: {
                            color: '#e5e5e5'
                        }
                    },
                    calculable: true,
                    //
                    grid: {
                        left: 60,
                        top: 50,
                        right: 15,
                        bottom: 100,
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow',
                                label: {
                                    show: true,
                                    // formatter: function (params) {
                                    //     return params.name.replace('\n', '');
                                    // }
                                }
                            }
                        }
                    },
                    //
                    xAxis: [
                        {
                            type: 'category',
                            axisLabel: {interval: 0, color: '#e5e5e5'},
                            data: (function () {
                                let list = [];
                                that.ruleList.forEach((n) => {
                                    list.push(n.name);
                                });
                                return list;
                            })(),
                            splitLine: {show: false},
                            axisLine: {
                                lineStyle: {
                                    color: '#495998'
                                }
                            },
                            axisTick: {
                                alignWithLabel: false,
                                show: false
                            }
                        }
                    ],
                    //
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                color: '#eee'
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#333e6b'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#495998'
                                }
                            },
                            axisTick: {
                                alignWithLabel: false,
                                show: false
                            }
                        }
                    ],
                    series: [
                        {name: '优', type: 'bar', barWidth: '14px'},
                        {name: '良', type: 'bar', barWidth: '14px'},
                        {name: '中', type: 'bar', barWidth: '14px'},
                        {name: '差', type: 'bar', barWidth: '14px'},
                        {
                            // name: 'DC',
                            width: 120,
                            label: {
                                show: false
                            },
                            type: 'pie',
                            center: ['50%', '0%'],
                            left: 'right',
                            top: 100,
                            // radius: '28%',
                            // percent: number,
                            // legendHoverLink: true,
                            minAngle: 5, // 最小角度数。
                            z: 100
                        }
                    ]
                },
                options: that.barData
            };

            /**
             * 使用刚指定的配置项和数据显示图表
             */
            this.myChart.setOption(option);

            /**
             * 改变左侧导航大小改变图表尺寸
             */
            $('#echart').resize(function () {
                that.myChart.resize();
            });

            /**
             * 浏览器窗口改变之后，改变chart的大小
             */
            window.addEventListener('resize', function () {
                that.myChart.resize();
            });

            /**
             * 图表时间抽事件，切换库
             */
            this.myChart.off('timelinechanged');
            this.myChart.on('timelinechanged', function (index) {
                // 时间抽下标；默认从0开始
                let currentIndex = index.currentIndex;
                // 切换model
                that.model = that.dbList[currentIndex];
                // 刷新页面
                that.refreshTable1();
                that.refreshTable2();
                that.current = 1;
                that.size = 10;
                that.refreshTable3();
            });

            /**
             * 点击规则
             */
            this.myChart.getZr().off('click');
            this.myChart.getZr().on('click', (params) => {
                // 停止自动播放
                // that.autoplay  = false
                const pointInPixel = [params.offsetX, params.offsetY];
                if (this.myChart.containPixel('grid', pointInPixel)) {
                    let xIndex = that.myChart.convertFromPixel({seriesIndex: 0}, [
                        params.offsetX,
                        params.offsetY
                    ])[0];
                    // 记录选中的规则
                    this.rule = that.ruleList[xIndex];
                    // 刷新表1
                    that.refreshTable1();
                    // 刷新表2
                    that.refreshTable2();
                    // 查询表3
                    that.current = 1;
                    that.size = 10;
                    that.refreshTable3();
                }
            });
        }
    },
    destroyed() {
        window.removeEventListener('resize', function () {
            myChart.resize();
        });
    }
};
</script>

<style lang="scss" scoped>
// 4个颜色
// #08c397 优 -a
// #21aced 良 -b
// #e4b617 中 -c
// #d38545 差 -d
$a: #08c397;
$b: #21aced;
$c: #e4b617;
$d: #d38545;
div {
    box-sizing: border-box;
}

.app {
    background: #39436a;
    box-sizing: border-box;
    width: 100%;
    min-width: 1130px;
    overflow: auto;
    padding: 0px 10px 50px 10px;

    .box {
        background: #283259;
        border: 1px solid #0e183f;
    }
}

.header {
    display: flex;
    justify-content: space-between;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: #fff;
    font-weight: bold;

    .hospital {
        width: 160px;

        &::v-deep input.el-input__inner {
            background-color: #4d5679;
            color: #fff;
            border: none;
        }
    }

    .riqi {
        width: 160px;

        &::v-deep input.el-input__inner {
            background-color: #4d5679;
            color: #fff;
            border: none;
        }
    }
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 100% !important;
}

.tubiao {
    height: 354px;
    margin-bottom: 10px;
    position: relative;
}

.table1 {
    min-width: 400px;
    height: 140px;
    margin-bottom: 10px;
    padding: 10px;

    &::v-deep .tdclass0 {
        color: $a;
    }

    &::v-deep .tdclass1 {
        color: $b;
    }

    &::v-deep .tdclass2 {
        color: $c;
    }

    &::v-deep .tdclass3 {
        color: $d;
    }
}

.table2 {
    height: 330px;
    padding: 10px;
    overflow: auto;
}

.table3 {
    height: 500px;
    overflow: auto;
    padding: 10px;
}

#echart {
    width: 100%;
    height: 100%;
}

.echart-title {
    position: absolute;
    left: 24px;
    top: 10px;
    color: #ededed;
    font-weight: bold;
    font-size: 14px;

    &::after {
        content: '';
        position: absolute;
        left: -12px;
        top: 5px;
        width: 8px;
        height: 8px;
        overflow: hidden;
        border-radius: 100%;
        background: #21aced;
    }
}

.table-title {
    position: relative;
    font-size: 14px;
    color: #fff;
    padding-left: 13px;

    &::after {
        content: '';
        position: absolute;
        left: 0px;
        top: 7px;
        width: 8px;
        height: 8px;
        overflow: hidden;
        border-radius: 100%;
        background: #21aced;
    }
}

.tips {
    font-size: 12px;
    color: #fff;

    p {
        display: inline-block;
        height: 34px;
        line-height: 34px;
        margin: 0;
        padding: 0;
        margin-right: 30px;

        span.a {
            color: $c;
        }
    }
}

// 自定义表格样式
::v-deep .el-table__header tr,
::v-deep .el-table__header th {
    padding: 0;
    height: 30px;
    background: #474e6d !important;
}

::v-deep .el-table__body tr,
::v-deep .el-table__body td {
    padding: 0;
    height: 30px;
    background: #323a5c !important;
}

// 边框
::v-deep .el-table--border {
    border-top: 1px solid #474e6d;
    border-left: 1px solid #474e6d;
}

::v-deep .el-table--border td {
    border-right: 1px solid #474e6d;
}

::v-deep .el-table td,
::v-deep .el-table th.is-leaf,
::v-deep .el-table--border,
::v-deep .el-table--group {
    border-color: #474e6d;

    .gaoliang {
        background-color: #535c86 !important;
    }
}

::v-deep .el-table--border::after,
::v-deep .el-table--group::after,
.el-table::before {
    background-color: #474e6d;
}

::v-deep .el-table th {
    background-color: #474e6d;
}

::v-deep .el-table--border th,
::v-deep .el-table__fixed-right-patch {
    color: #e5e5e5;
    border-bottom: 1px solid #474e6d !important;
    border-right: 1px solid #474e6d !important;
}

::v-deep .el-table td,
::v-deep .el-table th.is-leaf {
    font-weight: normal;
    color: #e5e5e5;
    border-bottom: 1px solid #474e6d !important;
}

// 隔行换色
::v-deep .el-table__row--striped td {
    background-color: #2f3757 !important;
}

// ::v-deep .el-table__row:hover td {
//     background-color: Transparent !important;
// }
// 接入汇总显示的图标
::v-deep .tableicon1 {
    font-size: 14px;
    text-align: center;

    .cell {
        display: none;
    }

    &.iconfont {
        color: #08c32b !important;
    }
}

::v-deep .tableicon2 {
    font-size: 14px;
    text-align: center;

    .cell {
        display: none;
    }

    &.iconfont {
        color: #e15d23 !important;
    }
}

.title-bottom-10 {
    margin-bottom: 10px;
}

::v-deep .class-zljg-you {
    color: $a !important;
}

::v-deep .class-zljg-liang {
    color: $b !important;
}

::v-deep .class-zljg-zhong {
    color: $c !important;
}

::v-deep .class-zljg-cha {
    color: $d !important;
}

.tableData1 {
    ::v-deep .el-table__row--striped td {
        background-color: #2f3757 !important;
    }

    // ::v-deep .el-table__row:hover td {
    // 鼠标滑过td的表格背景色
    // }
}

.echartnull {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 14px;
}

::v-deep div.el-table__empty-block {
    background: #283259;
}

::v-deep div.el-table__header-wrapper {
    background: #283259;
}

::v-deep div.el-table,
.el-table__expanded-cell {
    background: #323a5c;
}

.data-fenye {
    padding-right: 2px;
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

::v-deep .el-table__fixed-right::before,
::v-deep .el-table__fixed::before {
    background-color: transparent !important;
}

.right-select {
    display: flex;
}
</style>
