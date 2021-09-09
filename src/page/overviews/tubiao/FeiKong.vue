<!--
 * @Author: your name
 * @Date: 2021-01-21 10:01:17
 * @LastEditTime: 2021-03-02 14:02:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\overviews\tubiao\feiKong.vue
-->
<template>
  <div id="zhuzhicharts">
    <div class="r-box k-drak select-box">
      <div class="slot" @click="changeDirection">
        <i :class="sortDirection=='asc'?'el-icon-sort-up':(sortDirection=='desc'?'el-icon-sort-down':'el-icon-sort')"></i>
      </div>

      <el-select v-model="typeValue" @change="changeModel" class="select-mini" placeholder="请选择" size='mini'>
        <el-option v-for="item in typeList" :key="item.model" :label="item.model" :value="item.model">
        </el-option>
      </el-select>
    </div>
    <ve-bar :data="barData" :title="title" :extend="extend"></ve-bar>
  </div>
</template>

<script>
export default {
  data() {
    this.extend = {
      "xAxis.0.axisLabel.color": "white",
      "yAxis.0.axisLabel.color": "white",

      xAxis: { show: false },
      yAxis: {
        axisLabel: {
          //格式化Y轴最多只显示5个字
          textStyle: {
            color: "white",
          },
          formatter: function (params) {
            return params.length > 5 ? params.substr(0, 5) + "..." : params
          },
        },
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
                color: '#21aced', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#57beee' // 100% 处的颜色
              },
            ],
            global: false
          }
        }
      },
    };
    return {
      //  图表数据
      title: {
        text: "非空检测Top10",
        textStyle: {
          color: "#fff",
          fontWeight: "normal",
          fontSize: 14,
          lineHeight: 30,
        },
      },
      barData: null,


      // 组件数据
      typeValue: this.chartData[0].model,
      typeList: this.chartData,
      sortDirection: ""
    };
  },

  props: {
    chartData: {
      type: Array,
      default: [],
    },
  },

  mounted() {
    this.barData = zhuanHuanFeiKong(this);
  },

  methods: {
    changeDirection() {
      if (this.sortDirection === "asc")
        this.sortDirection = 'desc'
      else
        this.sortDirection = 'asc'

      this.barData = zhuanHuanFeiKong(this);
    },
    changeModel() {
      this.sortDirection = ''
      this.barData = zhuanHuanFeiKong(this);
    }
  }
};

function zhuanHuanFeiKong(vm) {
  var data = vm.chartData.find(item => item.model == vm.typeValue)
  let newObj = {};
  newObj.columns = ['name', '分数'];
  newObj.rows = []
  let num = 10;
  if (vm.sortDirection === "asc")
    num = data.resultsAsc.length < 10 ? data.resultsAsc.length : 10;
  else
    num = data.resultsDesc.length < 10 ? data.resultsDesc.length : 10;
  for (let i = 0; i < num; i++) {
    var obj = vm.sortDirection === "asc" ? data.resultsAsc[i] : data.resultsDesc[i]
    newObj.rows.unshift({
      name: obj.tableNameCN?.replace(/[^\u4E00-\u9FA5]/g, '')||'',
      '分数': obj.score
    })
  }

  return newObj
}


</script>

<style lang="scss" scoped>
#zhuzhicharts {
  position: relative;
}
.select-box {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
}

.select-mini {
  width: 80px;
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
