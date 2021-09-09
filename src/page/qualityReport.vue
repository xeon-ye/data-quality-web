<!-- 质量报告 -->
<template>
  <div class="page zlbg-body-bg">
    <!-- 左边导航 -->
    <div class="left-box">
      <leftmenu @timeLineData="getTimeLineData" ref="leftmenu"></leftmenu>
    </div>

    <div class="right-box">
      <!-- 顶部按钮组 -->
      <div class="r-header">
        <div class="left">
          <div class="search maring-bottom padding-0 k-drak">
            <el-select
                v-model="hospitalCode"
                placeholder="请选择"
                @change="changeHospital"
                class="mar-r-10"
                size="mini"
            >
              <el-option
                  v-for="item in hospitalListData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
              >
              </el-option>
            </el-select>
            <el-select v-model="jobType" size="mini" class="mar-r-10" @change="changeJobType">
              <el-option
                  v-for="(item, index) in jobList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
              ></el-option>
            </el-select>
          </div>
        </div>
        <!--        <div class="right">-->
        <!--          <el-link icon="icon el-icon-refresh icon-shauxin" :underline="false"-->
        <!--            >刷新</el-link-->
        <!--          >-->
        <!--          <el-link icon="icon el-icon-upload2 icon-daochu" :underline="false"-->
        <!--            >导出</el-link-->
        <!--          >-->
        <!--          <el-link icon="icon el-icon-back icon-fanhui" :underline="false"-->
        <!--            >返回</el-link-->
        <!--          >-->
        <!--        </div>-->
      </div>

      <!-- 主内容区 -->
      <div class="zlbg-right-box-bg" v-if="kongShuJu">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="chart-box">
              <div class="title title-etl">
                质量评估
                <span></span>
              </div>
              <div id="etlchart"></div>
              <!-- 时间轴 -->
              <div class="timeline">
                <div class="pre" @click="leiDaTuPrevious">
                  <i class="el-icon-arrow-left"></i>
                </div>

                <div class="line">
                  <ul>
                    <li
                        :class="{
                        act: item.index === actIndex
                      }"
                        v-for="item in timeLineData"
                        :key="item.index"
                        @click="changeTimeLine(item.index)"
                    >
                      <i class="el-icon-location"></i>
                      <span>{{ item.businessTime }}</span>
                    </li>
                  </ul>
                </div>

                <div class="next" @click="leiDaTuNext">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <!-- 描述信息 -->
            <div class="echart-info" v-if="chartsData">
              <h3 class="k-title">
                所选行详细信息：
              </h3>
              <dl class="e-dl">
                <dt class="e-dt">
                  日期：
                </dt>
                <dd class="e-dd">
                  {{ chartsData.businessTime }}
                </dd>
              </dl>
              <dl class="e-dl">
                <dt class="e-dt">
                  日志：
                </dt>
                <dd class="e-dd">
                  {{ chartsData.desc }}
                </dd>
              </dl>
              <dl class="e-dl">
                <dt class="e-dt">
                  步骤ID：
                </dt>
                <dd class="e-dd">
                  {{ chartsData.id }}
                </dd>
              </dl>
              <dl class="e-dl">
                <dt class="e-dt">
                  表名：
                </dt>
                <dd class="e-dd">
                  {{ tableInfo ? tableInfo.tablename || '' : '' }}
                </dd>
              </dl>
              <dl class="e-dl">
                <dt class="e-dt">
                  表中文名：
                </dt>
                <dd class="e-dd">
                  {{ tableInfo ? tableInfo.desc || '' : '' }}
                </dd>
              </dl>
              <dl class="e-dl">
                <dt class="e-dt">
                  持续时间：
                </dt>
                <dd class="e-dd">
                  {{ chartsData.execTime }}
                </dd>
              </dl>
              <dl class="e-dl">
                <dt class="e-dt">
                  重试次数：
                </dt>
                <dd class="e-dd">
                  {{ chartsData.retryNum }}
                </dd>
              </dl>
              <dl class="e-dl">
                <dt class="e-dt">
                  消息：
                </dt>
                <dd class="e-dd">
                  --
                </dd>
              </dl>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else class="kongshuju mar-b-10">空数据</div>
      <!-- 表格详细信息 -->
      <div class="zlbg-right-box-bg mar-top-20 k-from-dark" v-if="kongShuJu">
        <el-collapse v-model="activeName">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="pad-left-10">
                非空检测：<span class="fenshutxt">{{
                  chartsData ? chartsData.nonEmptyScore || 0 : 0
                }}</span>
              </div>
            </template>

            <div class="k-des--top">
              <span class="ms-tx mar-right-20"
              >表名称：{{ tableInfo ? tableInfo.tablename || '' : '' }}</span
              >
              <span class="ms-tx mar-right-20"
              >表中文名：{{ tableInfo ? tableInfo.desc || '' : '' }}</span
              >
              <span class="ms-tx mar-right-20"
              >统计数据行数：{{
                  chartsData
                      ? chartsData.nonEmptyResultList
                      ? chartsData.nonEmptyResultList.length
                      : 0
                      : 0
                }}</span
              >
            </div>

            <div class="in-table xh-dark-warp" v-if="chartsData&&chartsData.nonEmptyResultList">
              <el-table :data="chartsData.nonEmptyResultList" border :span-method="objectSpanMethod">
                <el-table-column type="index" label="序" width="50">
                </el-table-column>

                <el-table-column prop="field" label="字段名"> </el-table-column>

                <el-table-column prop="fieldComment" label="中文字段名">
                </el-table-column>

                <el-table-column prop="fillRate" label="填充率">
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>

          <el-collapse-item name="2">
            <template slot="title">
              <div class="pad-left-10">
                绝对值检测：<span class="fenshutxt">{{
                  chartsData ? chartsData.absScore || 0 : 0
                }}</span>
              </div>
            </template>

            <div class="k-des--top">
              <span class="ms-tx mar-right-20"
              >表名称：{{ tableInfo ? tableInfo.tablename || '' : '' }}</span
              >
              <span class="ms-tx mar-right-20"
              >表中文名：{{ tableInfo ? tableInfo.desc || '' : '' }}</span
              >
              <span class="ms-tx mar-right-20"
              >统计数据行数：{{
                  chartsData && chartsData.absResultList ? chartsData.absResultList.length || 0 : 0
                }}</span
              >
            </div>


            <div class="in-table" v-if="chartsData&&chartsData.absResultList">
              <el-table
                  :data="chartsData.absResultList"
                  border
                  style="width: 100%"
              >
                <el-table-column type="index" label="序" width="50">
                </el-table-column>

                <el-table-column prop="tableName" label="表名"></el-table-column>

                <el-table-column prop="tableNameCN" label="表中文名">
                </el-table-column>

                <el-table-column prop="field" label="列英文名">
                </el-table-column>

                <el-table-column prop="fieldComment" label="列中文名">
                </el-table-column>

                <el-table-column prop="total" label="总记录"></el-table-column>

                <el-table-column prop="detection" label="被检测记录">
                </el-table-column>

                <el-table-column prop="satisfied" label="满足条件">
                </el-table-column>

                <el-table-column prop="unsatisfied" label="不满足条件">
                </el-table-column>

                <el-table-column prop="name" label="正确率">
                  <template slot-scope="scope">
                    {{
                      Math.floor((scope.row.satisfied / scope.row.total) * 100)
                    }}%
                  </template>
                </el-table-column>

                <el-table-column prop="businessTime" label="校验时间" width="150">
                  <template slot-scope="scope">
                    {{ (new Date().getTime() - 5 * 60 * 1000) | moment }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>


          <!-- 源目 -->
          <el-collapse-item name="3">
            <template slot="title">
              <div class="pad-left-10">
                源目检测：<span class="fenshutxt">{{
                  chartsData ? chartsData.sourceTargetScore || 0 : 0
                }}</span>
              </div>
            </template>

            <div class="k-des--top">
              <span class="ms-tx mar-right-20"
              >表名称：{{ tableInfo ? tableInfo.tablename || '' : '' }}</span
              >
              <span class="ms-tx mar-right-20"
              >表中文名：{{ tableInfo ? tableInfo.desc || '' : '' }}</span
              >
              <span class="ms-tx mar-right-20"
              >统计数据行数：{{
                  chartsData && chartsData.sourceTargetResultList ? chartsData.sourceTargetResultList.length || 0 : 0
                }}</span
              >
            </div>

            <div class="in-table" v-if="chartsData&&chartsData.sourceTargetResultList">
              <el-table
                  :data="chartsData.sourceTargetResultList"
                  border
                  style="width: 100%"
              >
                <el-table-column type="index" label="序" width="50">
                </el-table-column>

                <el-table-column prop="tableName" label="表名"></el-table-column>

                <el-table-column prop="tableNameCN" label="表中文名">
                </el-table-column>

                <el-table-column prop="targetTotal" label="目标表数据总量">
                </el-table-column>

                <el-table-column prop="targetMore" label="目标表差异量">
                </el-table-column>

                <el-table-column prop="sourceTotal" label="源表数据总量"></el-table-column>

                <el-table-column prop="sourceMore" label="源表差异量">
                </el-table-column>

                <el-table-column prop="score" label="分数">
                </el-table-column>

                <el-table-column prop="businessTime" label="校验时间">
                  <template slot-scope="scope">
                    {{ (new Date().getTime() - 5 * 60 * 1000) | moment }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>


          <!-- 主子 -->
          <el-collapse-item name="4">
            <template slot="title">
              <div class="pad-left-10">
                主子关联检测：<span class="fenshutxt">{{
                  chartsData ? chartsData.mainDetailScore || 0 : 0
                }}</span>
              </div>
            </template>

            <div class="k-des--top">
              <span class="ms-tx mar-right-20"
              >表名称：{{ tableInfo ? tableInfo.tablename || '' : '' }}</span
              >
              <span class="ms-tx mar-right-20"
              >表中文名：{{ tableInfo ? tableInfo.desc || '' : '' }}</span
              >
              <span class="ms-tx mar-right-20"
              >统计数据行数：{{
                  chartsData && chartsData.mainDetailResults ? chartsData.mainDetailResults.length || 0 : 0
                }}</span
              >
            </div>

            <div class="in-table" v-if="chartsData&&chartsData.mainDetailResults">
              <el-table
                  :data="chartsData.mainDetailResults"
                  border
                  style="width: 100%"
              >
                <el-table-column type="index" label="序" width="50">
                </el-table-column>

                <el-table-column prop="tableName" label="表名"></el-table-column>

                <el-table-column prop="tableNameCN" label="表中文名">
                </el-table-column>

                <el-table-column prop="total" label="子表数据量">
                </el-table-column>

                <el-table-column prop="match" label="匹配数据量">
                </el-table-column>

                <el-table-column prop="score" label="分数">
                </el-table-column>

                <el-table-column prop="businessTime" label="校验时间">
                  <template slot-scope="scope">
                    {{ (new Date().getTime() - 5 * 60 * 1000) | moment }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>


          <!-- 枚举值 -->
          <el-collapse-item name="5">
            <template slot="title">
              <div class="pad-left-10">
                枚举值检测：<span class="fenshutxt">{{
                  chartsData ? chartsData.enumScore || 0 : 0
                }}</span>
              </div>
            </template>

            <div class="k-des--top">
              <span class="ms-tx mar-right-20"
              >表名称：{{ tableInfo ? tableInfo.tablename || '' : '' }}</span
              >
              <span class="ms-tx mar-right-20"
              >表中文名：{{ tableInfo ? tableInfo.desc || '' : '' }}</span
              >
              <span class="ms-tx mar-right-20"
              >统计数据行数：{{
                  chartsData && chartsData.enumResults ? chartsData.enumResults.length || 0 : 0
                }}</span
              >
            </div>

            <div class="in-table" v-if="chartsData&&chartsData.enumResults">
              <el-table
                  :data="chartsData.enumResults"
                  border
                  style="width: 100%"
              >
                <el-table-column type="index" label="序" width="50">
                </el-table-column>

                <el-table-column prop="tableName" label="表名"></el-table-column>

                <el-table-column prop="tableNameCN" label="表中文名">
                </el-table-column>

                <el-table-column prop="field" label="字段"></el-table-column>
                <el-table-column prop="total" label="数据总量">
                </el-table-column>

                <el-table-column prop="satisfied" label="满足条件记录">
                </el-table-column>

                <el-table-column prop="unsatisfied" label="不满足条件记录">
                </el-table-column>

                <el-table-column prop="score" label="分数">
                </el-table-column>

                <!--                        <el-table-column prop="businessTime" label="校验时间">-->
                <!--                        </el-table-column>-->
              </el-table>
            </div>
          </el-collapse-item>


        </el-collapse>
      </div>
      <div v-else class="kongshuju">空数据</div>
    </div>
  </div>
</template>

<script>
import bus from '@/util/bus.js';
import XEUtils from 'xe-utils';
import {msgSuccess, msgWarning, msgError} from '@/util/message.js';

var myChart;

// 引用左边导航组件模板
import leftmenu from './components/LeftMenu.vue';
import Template from './components/template.vue';

export default {
  name: 'ZhiLiangPingGuLeiDaTu',
  components: {
    leftmenu,
    Template
  },
  data() {
    return {
      kongShuJu: null,
      hospitalCode: null,
      hospitalListData: [],
      actIndex: 0,
      activeName: ['1', '2'],
      baogaochaxun: '',
      tableData: [],
      timeLineData: [],
      lineData: [],
      chartsData: null,
      tableInfo: null,
      jobList: [],
      jobType: null,
      rowspans: []
    };
  },
  mounted() {
    let that = this;

    this.getHospitalList();
    // 渲染图表

    window.addEventListener('resize', function () {
      setTimeout(() => {
        myChart.resize();
      }, 500);
    });

    // 接收参数请求图表数据
    bus.$on('postpom', (val) => {
      that.cdata = val;
      // that.getReportdata({
      //     date: "2020-7-21",
      //     table: val.xhtable,
      //     type: val.xhtype
      // });
    });
  },
  methods: {
    changeHospital(val) {
      this.getHospitalList(val);
    },

    mergeRowMethod({row, _rowIndex, column, visibleData}) {
      const fields = ['fillRate'];
      const cellValue = XEUtils.get(row, column.property);
      if (cellValue && fields.includes(column.property)) {
        const prevRow = visibleData[_rowIndex - 1];
        let nextRow = visibleData[_rowIndex + 1];
        if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
          return {rowspan: 0, colspan: 0};
        } else {
          let countRowspan = 1;
          while (
              nextRow &&
              XEUtils.get(nextRow, column.property) === cellValue
              ) {
            nextRow = visibleData[++countRowspan + _rowIndex];
          }
          if (countRowspan > 1) {
            return {
              rowspan: countRowspan,
              colspan: 1
            };
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        if (this.rowspans.includes(rowIndex)) {
          let index = this.rowspans.indexOf(rowIndex)
          let nextRowspan = this.rowspans.length - 1 > index ? this.rowspans[index + 1] : this.chartsData.nonEmptyResultList.length
          return {
            rowspan: nextRowspan - rowIndex,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 雷达图时间抽操作
    leiDaTuPrevious() {
      if (this.actIndex > 0) {
        this.actIndex--;
      }
      if(this.actIndex<this.timeLineData[0].index){
        this.timeLineData = this.lineData.slice(this.actIndex,this.actIndex+5)
      }
    },

    leiDaTuNext() {
      if (this.actIndex < this.lineData.length - 1) {
        this.actIndex++;
      }
      if(this.actIndex>this.timeLineData[4].index){
        this.timeLineData = this.lineData.slice(this.actIndex-4,this.actIndex+1)
      }
    },

    getTimeLineData(data) {
      // 获取前五条用来显示数据
      data.forEach((element,index) => {
        element.index =index
      });
      this.lineData = data
      this.timeLineData = data.slice(0, 5);
      this.actIndex = 0;

      // 初始化数据
      if (data[0]) {
        this.kongShuJu = true;
        // this.showChartView(data[0].id);
        this.showChartView({id: data[0].id, model: data[0].model, table: data[0].tableName});
      } else {
        if (data.desc) {
          this.kongShuJu = false;
          //   msgWarning(data.desc + ",没有核查数据");
        }
      }

      this.tableInfo = {
        tablename: data.tablename,
        desc: data.desc
      };
    },

    showChartView(data) {
      var that = this;
      let param = {
        jobId: data.id,
        model: data.model,
        table: data.table || data.tableName,
        jobType: this.jobType
      }
      this.$R.getoverview(param).then((res) => {
        if(!res){
          msgWarning("暂无数据");
        }
        var resData = res;
        this.chartsData = resData;
        that.createETLEcharts({
          yuZhiXing: [
            resData?.absScore || 0,
            resData?.nonEmptyScore || 0,
            resData?.enumScore || 0,
            resData?.mainDetailScore || 0,
            resData?.sourceTargetScore || 0,
            resData?.rowScore || 0,
          ]
        });

        let rowspans = [0]
        if (res?.nonEmptyResultList && res?.nonEmptyResultList.length) {
          let lastRate = res.nonEmptyResultList[0].fillRate
          res.nonEmptyResultList.forEach((element, index) => {
            if (element.fillRate !== lastRate) {
              rowspans.push(index)
              lastRate = element.fillRate
            }
          });
        }
        this.rowspans = rowspans
      });
    },

    getHospitalList(hospitalCode = null) {
      let that = this;

      this.$R.queryDict({
        types: 'dept,job'
      })
          .then((res) => {
            that.hospitalListData = res.dept;
            that.jobList = res.job
            if (res.job && res.job.length)
              that.jobType = res.job[0].code;
            // 调用子节点-左侧树的数据
            try {
              if (hospitalCode) {
                that.$refs.leftmenu.getcomparemodel(hospitalCode, that.jobType);
              } else {
                that.hospitalCode = res.dept[0].code;
                that.$refs.leftmenu.getcomparemodel(that.hospitalCode, that.jobType);
              }
            } catch (error) {
              msgError('获取医院code失败，请检测接口。');
              console.log('error :>>获取医院code失败，请检测接口', error);
            }
          })
          .catch((err) => {
            alert('请联系管理员，请求错误。');
            console.log('object :>>请求医院列表信息错误', err);
          });
    },
    changeJobType() {
      this.$refs.leftmenu.getcomparemodel(this.hospitalCode, this.jobType);
    },

    changeTimeLine(index) {
      this.actIndex = index;
    },

    // 创建ETL质量评估图表
    createETLEcharts(chardData) {
      myChart = this.$echarts.init(document.getElementById('etlchart'));
      let option = {
        tooltip: {},
        color: ['#d38545', '#e4b617', '#21aced'],
        grid: {
          top: 180,
          left: 520
        },
        legend: {
          right: 10,
          top: 20,
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        radar: {
          center: ['50%', 200], // 位置
          radius: 110, //大小
          splitArea: {
            show: true,
            areaStyle: {
              color: ['#6172b3', '#3a487b'],
              shadowBlur: 0
            }
          },
          splitLine: {
            show: false
          },
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              padding: [0, 0]
            }
          },
          indicator: [
            {
              name: '绝对值检测',
              max: 100
            },
            {name: '非空检查', max: 100},
            {
              name: '枚举值检测',
              max: 100
            },
            {
              name: '主子关联检测',
              max: 100
            },
            {name: '源目检测', max: 100},
            {name: '波动率检测', max: 100}
          ],
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
              width: 1.5
            }
          }
        },
        series: [
          {
            type: 'radar',
            areaStyle: {normal: {}},

            data: [
              {
                value: chardData.yuZhiXing,
                // name: '日增量'
              }
            ],

            // 线的样式：
            itemStyle: {
              // color: ["#d3854","#e4b617","#21aced"]
            }
          }
        ]
      };

      myChart.setOption(option);
    }
  },

  watch: {
    actIndex(newValue, oldValue) {
      this.showChartView(this.lineData[newValue]);
    }
  }
};
</script>

<style lang="scss" scoped>
.timeline {
  box-sizing: border-box;
  width: 100%;
  padding: 0 40px;
  display: flex;
  align-items: center;
  margin-top: 0px;
  margin-bottom: 40px;
  position: relative;

  .play {
    width: 18px;
    height: 18px;
  }

  .line {
    width: 100%;
    height: 6px;
    background: #2b355f;
    border-radius: 5px;
    border: 1px solid #262f54;

    ul {
      display: flex;
      // width: 100%;
      margin: 0;
      padding: 0 20px;
      margin-top: -10px;

      li {
        width: 20%;
        margin: 0;
        padding: 0;
        display: inline-block;
        list-style: none;
        color: #333f70;
        font-size: 18px;
        display: flex;
        flex-direction: column;
        text-align: center;

        i {
          display: block;
        }

        span {
          display: block;
          font-size: 12px;
          color: #fff;
        }

        &:hover {
          color: #21aced;

          cursor: pointer;

          span {
            color: #21aced;
          }
        }

        &.act {
          color: #21aced;
          cursor: pointer;

          span {
            color: #21aced;
          }
        }
      }
    }
  }

  .pre,
  .next {
    width: 18px;
    height: 18px;
    background: #39436a;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;

    &:hover {
      background: #21aced;
      cursor: pointer;
    }
  }
}

::v-deep .el-icon-arrow-left,
::v-deep .el-icon-arrow-right {
  color: #fff;
}

html {
  font-size: 12px;
}

div {
  box-sizing: border-box;
}

.page {
  display: flex;
  flex-flow: row;
  height: 100%;
  min-height: 540px;

  .left-box {
    width: 240px;
    height: 100%;
  }

  .right-box {
    flex: 1;
    height: 100%;
    padding: 10px;
    overflow: auto;
    padding-bottom: 40px;
    background: #424a6c;

    .r-header {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
    }

    .r-box {
      overflow: auto;
      height: calc(100vh - 150px);
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

      &::v-deep .icon-shauxin {
        color: #deb73b !important;
        margin-left: 15px;
      }

      &::v-deep .icon-daochu {
        color: #2bcb5c !important;
        margin-left: 15px;
      }

      &::v-deep .icon-fanhui {
        color: #2370c3 !important;
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

.zlbg-right-box-bg {
  background-color: #283259;
  border: 1px solid #0e183f;
}

.maring-bottom {
  margin-bottom: 10px;
}

// 修改左边导航样色
.nav {
  padding-bottom: 20px;

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
  }
}

.e-dl {
  margin: 0;
}

// 图标样色
.chart-box {
  width: 100%;
  position: relative;
  box-sizing: border-box;

  .title-etl {
    color: #e6e6e6;
    font-size: 14px;
    position: absolute;
    left: 0px;
    top: 0px;
  }
}

.k-title {
  margin: 20px 0 10px 20px;
  padding: 0;
  font-weight: normal;
  font-size: 14px;
  color: #e6e6e6;
}

#etlchart {
  width: 100%;
  height: 360px;
}

.echart-info {
  padding-left: 10px;
  padding-bottom: 10px;
}

.e-dt {
  width: 100px;
  text-align: right;
  color: #e6e6e6;
  font-size: 14px;
  padding-left: 14px;
  line-height: 30px;
  display: inline-block;
}

.e-dd {
  color: #b3b3b3;
  font-size: 14px;
  line-height: 30px;
  display: inline;
  margin: 0;
}

.padding-10 {
  padding: 10px;
}

.kongshuju {
  width: 100%;
  color: #e6e6e6;
  height: 300px;
  background: #283259;
  border: 1px solid #0e183f;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zlbg-body-bg {
  height: 100%;
  overflow: hidden;
}

.fenshutxt {
  color: #eda721;
}

::v-deep .el-icon-arrow-left:before {
  content: '\e6de';
}

::v-deep .el-icon-arrow-right:before {
  content: '\e6e0';
}

::v-deep .k-from-dark .el-table th {
  color: #d0d1d6;
}

::v-deep .k-from-dark .el-table th {
  background: #474e6d !important;
}
</style>
