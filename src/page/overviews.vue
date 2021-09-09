<!--
 * @Author: your name
 * @Date: 2021-01-20 15:03:33
 * @LastEditTime: 2021-03-11 13:19:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\overviews\index.vue
-->
<template>
  <div class="overviews">
    <div class="header">
      <h1>质量概览</h1>
      <div class="r-box k-drak">
        <el-select
            size="mini"
            v-model="jigouVal"
            placeholder="机构选择"
            class="mar-r-10 "
            @change="changeJiGou"
        >
          <el-option
              v-for="item in jiGouList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
          ></el-option>
        </el-select>
        <el-select v-model="jobType" size="mini" class="mar-r-10 ">
          <el-option
              v-for="(item, index) in jobList"
              :key="index"
              :label="item.name"
              :value="item.code"
          ></el-option>
        </el-select>
        <el-date-picker
            v-model="yueBaoPiCi"
            type="date"
            v-if="jobType=='day'"
            size="mini"
            style="width:193px"
            value-format="yyyy-MM-dd"
            @change="getChartData"
            :clearable="false"
            placeholder="选择日期">
        </el-date-picker>
        <el-date-picker
            v-model="yueBaoPiCi"
            type="month"
            v-else-if="jobType=='month'"
            size="mini"
            style="width:193px"
            value-format="yyyy-MM"
            @change="getChartData"
            :clearable="false"
            placeholder="选择月份">
        </el-date-picker>
        <el-select v-model="yueBaoPiCi" size="mini" v-else @change="getChartData">
          <el-option
              v-for="(item, index) in yueBaoPiCiList"
              :key="index"
              :label="item.name"
              :value="item.code"
          ></el-option>
        </el-select>
      </div>
    </div>
    <!-- 图表 -->
    <div class="tubiao">
      <el-row :gutter="10" class="mar-b-10">
        <el-col :span="7">
          <div class="k-content">
            <bo-dong-lu
                v-if="chartDataBoDongLu&&chartDataBoDongLu.rows&&chartDataBoDongLu.rows.length>0"
                :chart-data="chartDataBoDongLu"
            />
            <div class="kongshuju" v-else>空数据</div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="k-content">
            <zhi-liang-zheng-ti
                v-if="chartDataZhiLiangZhengTi&&chartDataZhiLiangZhengTi.rows&&chartDataZhiLiangZhengTi.rows.length>0"
                :chart-data="chartDataZhiLiangZhengTi"
            />
            <div class="kongshuju" v-else>空数据</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="k-content">
            <yu-mu ref='yumu' v-if="chartDataYuanMu&&chartDataYuanMu.length" :chart-data="chartDataYuanMu"/>
            <div class="kongshuju" v-else>空数据</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="7">
          <div class="k-content">
            <ju-dui-zhi
                v-if="chartDataJuDuiZhi&&chartDataJuDuiZhi.length>0"
                :chart-data="chartDataJuDuiZhi"
            />
            <div class="kongshuju" v-else>空数据</div>
          </div>
        </el-col>
        <el-col :span="10">
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="k-content ">
                <fei-kong
                    v-if="chartDataFeiKong&&chartDataFeiKong.length>0"
                    :chart-data="chartDataFeiKong"
                />
                <div class="kongshuju" v-else>空数据</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="k-content">
                <zhu-zhi v-if="chartDataZhuZhi&&chartDataZhuZhi.length>0"
                         :chart-data="chartDataZhuZhi"/>
                <div class="kongshuju" v-else>空数据</div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <div class="k-content">
            <mei-ju v-if="chartDataMeiJu&&chartDataMeiJu.length>0" :chart-data="chartDataMeiJu"/>
            <div class="kongshuju" v-else>空数据</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import BoDongLu from './overviews/tubiao/BoDongLu';
import FeiKong from './overviews/tubiao/FeiKong';
import JuDuiZhi from './overviews/tubiao/JuDuiZhi';
import MeiJu from './overviews/tubiao/MeiJu';
import YuMu from './overviews/tubiao/YuMu';
import ZhuZhi from './overviews/tubiao/ZhuZhi';
import ZhiLiangZhengTi from './overviews/tubiao/ZhiLiangZhengTi';
import {formatDate} from './js/format.js';
import settings from '@/settings'

export default {
  components: {
    BoDongLu,
    FeiKong,
    JuDuiZhi,
    MeiJu,
    YuMu,
    ZhiLiangZhengTi,
    ZhuZhi
  },
  data() {
    return {
      jiGouList: [],
      jigouVal: null,
      yueBaoPiCi: null,
      jobType: null,
      yueBaoPiCiList: [],
      chartDataBoDongLu: null,
      chartDataZhiLiangZhengTi: null,
      chartDataYuanMu: null,
      chartDataJuDuiZhi: null,
      chartDataFeiKong: null,
      chartDataZhuZhi: null,
      chartDataMeiJu: null,
      jobList: [],
      intervalDays: settings.intervalDays || 0
    };
  },

  methods: {
    getJiGouList() {
      let that = this;
      this.$R
          .queryDict({
            types: 'dept,job'
          })
          .then((res) => {
            that.jiGouList = res.dept;
            that.jigouVal = that.jiGouList[0].code;
            that.jobList = res.job;
            if (res.job && res.job.length)
              that.jobType = res.job[0].code;
          });
    },
    /**
     * @description:
     * @param {*} obj : 传入的参数
     * @param {*} type：类型，下拉选中的时候执行不同的操作。
     * @return {*}
     */
    getYueBaoPiCi() {
      let that = this;
      try {
        this.$R
            .monthbatch({
              hospital: this.jigouVal,
              jobType: this.jobType
            })
            .then((res) => {
              that.yueBaoPiCiList = res;
              this.yueBaoPiCi = res && res.length ? res[0].code : ""
              if (this.yueBaoPiCiList && this.yueBaoPiCiList.length) {
                this.getChartData()
              } else {
                chartsDataNull(this);
              }
            });
      } catch (error) {
        console.log(error);
      }
    },

    getChartData() {
      let that = this;
      let data = {
        dept: this.jigouVal,
        jobType: this.jobType,
      }
      if (this.jobType === 'day')
        data.date = this.yueBaoPiCi
      else if (this.jobType === 'month')
        data.date = this.yueBaoPiCi + "-01"
      else
        data.jobId = this.yueBaoPiCi

      this.getScores(data);
      this.getRow(data);
      this.getSoureceTarget(data);
      this.getAbs(data);
      this.getEnum(data);
      this.getMainDetail(data);
      this.getNonEmpty(data);
      // this.$R
      //         .reportmonth(data)
      //         .then((res) => {
      //             // 请求的数据转换之后，给到子组件显示数据
      //             if(res.row){
      //                 that.chartDataBoDongLu = converterBoDongLuData(res.row);
      //             }
      //             if(res.scores){
      //                 that.chartDataZhiLiangZhengTi = converterZhiLiangZhengTiData(res.scores);
      //             }
      //             if(res.soureceTarget){
      //                 that.chartDataYuanMu = converterYuanMu(res.soureceTarget);
      //             }
      //             if(res.abs){
      //                 that.chartDataJuDuiZhi = converterJuDuiZhi(res.abs);
      //             }
      //             if(res.nonempty){
      //                 that.chartDataFeiKong = res.nonempty;
      //             }
      //             if(res.mainDetail){
      //                 that.chartDataZhuZhi = res.mainDetail;
      //             }
      //             if(res.enums){
      //                 that.chartDataMeiJu = res.enums;
      //             }
      //         });
    },

    changeJiGou(val) {
      if(this.jobType!=='day'&&this.jobType!=='month')
        this.getYueBaoPiCi();
      else
        this.getChartData()
    },

    getScores(param) {
      let that = this;
      this.$R
          .indexScoreCharts(param)
          .then((res) => {
            that.chartDataZhiLiangZhengTi = converterZhiLiangZhengTiData(res);
          })
    },
    getRow(param) {
      let that = this;
      this.$R
          .indexRowCharts(param)
          .then((res) => {
            that.chartDataBoDongLu = converterBoDongLuData(res);
          })
    },
    getSoureceTarget(param) {
      let that = this;
      this.$R
          .indexSourceTargetCharts(param)
          .then((res) => {
            // that.chartDataYuanMu = converterYuanMu(res);
            that.chartDataYuanMu = res;
            that.$refs.yumu&&that.$refs.yumu.updateEcharts(res)
          })
    },
    getAbs(param) {
      let that = this;
      this.$R
          .indexAbsCharts(param)
          .then((res) => {
            that.chartDataJuDuiZhi = converterJuDuiZhi(res);
          })
    },
    getEnum(param) {
      let that = this;
      this.$R
          .indexEnumCharts(param)
          .then((res) => {
            that.chartDataMeiJu = res;
          })
    },
    getMainDetail(param) {
      let that = this;
      this.$R
          .indexMainDetailCharts(param)
          .then((res) => {
            that.chartDataZhuZhi = res;
          })
    },
    getNonEmpty(param) {
      let that = this;
      this.$R
          .indexNonEmptyCharts(param)
          .then((res) => {
            that.chartDataFeiKong = res;
          })
    }

  },

  mounted() {
    this.getJiGouList();
  },
  watch: {
    jobType() {
      if (this.jobType) {
        if (this.jobType === 'day') {
          this.yueBaoPiCi = formatDate(new Date(new Date().getTime() + this.intervalDays * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
          this.getChartData()
        } else if (this.jobType === 'month') {
          this.yueBaoPiCi = formatDate(new Date(), "yyyy-MM")
          this.getChartData()
        } else {
          this.getYueBaoPiCi()
        }
      }
    },
  }
};

// 波动率数据格式转换
function converterBoDongLuData(data) {
  var res = {
    columns: [],
    rows: []
  };
  try {
    data.forEach((item) => {
      res.columns.push(item.model);
      item.results.forEach((item2) => {
        res.rows.push({
          time: item2.dateTime.split(' ')[0],
          [item.model]: item2.total
        });
      });
    });
  } catch (error) {
    console.log('波动率数据请求错误 :>> ', error);
  }

  res.columns.unshift('time');
  return res;
}

// 质量整体概况
function converterZhiLiangZhengTiData(data) {
  var res = {
    columns: [
      'model',
      'absScore',
      'enumScore',
      'mainDetailScore',
      'nonEmptyScore',
      'rowScore',
      'sourceTargetScore'
    ],
    rows: []
  };

  try {
    data.forEach((item) => {
      res.rows.push({
        model: item['model'],
        absScore: item['absScore'],
        enumScore: item['enumScore'],
        mainDetailScore: item['mainDetailScore'],
        nonEmptyScore: item['nonEmptyScore'],
        rowScore: item['rowScore'],
        sourceTargetScore: item['sourceTargetScore']
      });
    });
  } catch (error) {
    console.log('质量整体数据格式错误，请查看接口 :>> ', error);
  }

  return res;
}

// 源目数据格式转换
function converterYuanMu(data) {
  var obj = {};
  obj.links = data;
  obj.nodes = [];
  let nameArr = [];
  data.forEach((item) => {
    nameArr.push(item.source);
    nameArr.push(item.target);
  });

  nameArr = Array.from(new Set(nameArr));

  nameArr.forEach((item) => {
    obj.nodes.push({name: item});
  });

  return obj;
}

function converterJuDuiZhi(data) {
  return data;
}

// 数据为空
function chartsDataNull(vm) {
  // 请求的数据转换之后，给到子组件显示数据
  vm.chartDataBoDongLu = null;
  vm.chartDataZhiLiangZhengTi = null;
  vm.chartDataYuanMu = null;
  vm.chartDataJuDuiZhi = null;
  vm.chartDataFeiKong = null;
  vm.chartDataZhuZhi = null;
  vm.chartDataMeiJu = null;
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 40px;
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;

  h1 {
    line-height: 40px;
    font-size: 14px;
    color: #fff;
  }

  .r-box {
    width: 50%;
    display: flex;
    justify-content: flex-end;
  }
}

.tubiao {
  padding: 0px 10px 20px;
  background: #39436a;
}

.k-content {
  width: 100%;
  height: 400px;
  background: 283259;
  border: 1px solid #0e183f;
  background: #283259;
}

.overviews {
  background: #39436a;
  height: 100%;
}

.kongshuju {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #fff;
}
</style>
