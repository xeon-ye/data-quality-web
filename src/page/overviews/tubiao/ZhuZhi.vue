<!--
 * @Author: your name
 * @Date: 2021-01-26 13:25:38
 * @LastEditTime: 2021-03-02 14:06:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\overviews\tubiao\ZhuZhi.vue
-->
<template>
  <div id="chartszhuzhi">
    <div class="r-box k-drak select-box">
      <div class="slot" @click="changeDirection">
        <i :class="sortDirection=='asc'?'el-icon-sort-up':(sortDirection=='desc'?'el-icon-sort-down':'el-icon-sort')"></i>
      </div>

      <el-select v-model="typeValue" @change="changeModel" class="select-mini" placeholder="请选择" size="mini">
        <el-option v-for="item in typeList" :key="item.model" :label="item.model" :value="item.model">
        </el-option>
      </el-select>
    </div>
    <ve-bar :data="barData" :title="title" :extend="extend"></ve-bar>
  </div>
</template>

<script>
export default {
  props: {
    chartData: {
      type: Array,
      default: [],
    },
  },
  data() {
    this.extend = {
      "xAxis.0.axisLabel.color": "white",
      "yAxis.0.axisLabel.color": "white",

      xAxis: { show: false },
      yAxis: {
        position: 'right',
        axisLabel: {
          //格式化Y轴最多只显示5个字
          textStyle: {
            color: "white",
          },
          formatter: function (params) {
            return params.length > 10 ? params.substr(0, 10) + "..." : params
          },
        },
      },
      tooltip: {
        formatter(params) {
          return params[0].name + "<br/>&nbsp;&nbsp;分数：" + (-params[0].value)
        }
      },
      legend: {
        data: []
      },
      "series.0.itemStyle": {
        normal: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: '#38e599', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#1ec37a' // 100% 处的颜色
              },
            ],
            global: false
          }
        }
      },
    };

    return {
      // 图表数据
      title: {
        text: "主子Top10",
        textStyle: {
          color: "#fff",
          fontWeight: "normal",
          fontSize: 14,
          lineHeight: 30,
        },
      },
      barData: null,

      //   组件数据
      typeValue: this.chartData[0].model,
      typeList: this.chartData,
      sortDirection: ""
    };
  },

  mounted() {
    this.barData = zhuanHuanChartsData(this);
  },

  methods: {
    changeDirection() {
      if (this.sortDirection === "asc")
        this.sortDirection = 'desc'
      else
        this.sortDirection = 'asc'

      this.barData = zhuanHuanChartsData(this);
    },
    changeModel() {
      this.sortDirection = ''
      this.barData = zhuanHuanChartsData(this);
    }
  }
};

function zhuanHuanChartsData(vm) {
  var data = vm.chartData.find(item => item.model == vm.typeValue)
  var newObj = {};
  newObj.columns = ['名称', '分数'];
  newObj.rows = []
  let num = 10;
  if (vm.sortDirection === "asc")
    num = data.resultsAsc.length < 10 ? data.resultsAsc.length : 10;
  else
    num = data.resultsDesc.length < 10 ? data.resultsDesc.length : 10;
  for (let i = 0; i < num; i++) {
    //    resultsAsc：低到高；resultsDesc：高到低；
    var obj = vm.sortDirection === "asc" ? data.resultsAsc[i] : data.resultsDesc[i]
    //分数按负数显示，让图标居于坐标轴第一象限，再formatter显示正数
    newObj.rows.unshift({
      '名称': obj.tableNameCN,
      '分数': -obj.score
    })
  }
  return newObj
}

</script>

<style lang="scss" scoped>
#chartszhuzhi {
  position: relative;
}
.select-box {
  width: 80px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 999;
}

.slot i {
  color: white;
  font-size: 16px;
  top: 7px;
  position: absolute;
  left: -20px;
  cursor: pointer;
  &:hover {
    color: #21aced;
  }
}
</style>
