<!--
 * @Author: your name
 * @Date: 2021-01-21 10:01:02
 * @LastEditTime: 2021-02-22 17:22:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\overviews\tubiao\YuMu.vue
-->
<template>
  <div id="yuanmuecharts">
    <div id="main"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

// // 模拟数据
// var data = {
//   links:  [{
//         "source": "DC",
//         "target": "CDR",
//         "value": 18
//     }, {
//         "source": "DL",
//         "target": "DC",
//         "value": 14
//     }, {
//         "source": "DC",
//         "target": "RDR",
//         "value": 27
//     }],
//   nodes: [{ name: "DC" }, { name: "DL" }, { name: "CDR" }, {name:'RDR'}],
// };

function initEcharts(data) {
  var chartDom = document.getElementById("main");
  var myChart = echarts.init(chartDom);
  var option;
  //设置颜色
  var itemColors = ["#e4b617", "#38e5cf", "#24b5f9", "#36e373"]
  var lineColors = ['#35c1b7', '#24b5f9', '#33c06e']
  for (let index = 0; index < data.nodes.length; index++) {
    var color = itemColors.length > index ? itemColors[index] : "#36e373"
    data.nodes[index].itemStyle = { color: color }
  }
  for (let jndex = 0; jndex < data.links.length; jndex++) {
    var color = lineColors.length > jndex ? lineColors[jndex] : "#33c06e"
    data.links[jndex].lineStyle = { color: color, opacity: 0.2 }
  }
  myChart.setOption(
    (option = {
      title: {
        text: "源目检测",
        textStyle: {
          color: "#fff",
          fontWeight: "normal",
          fontSize: 14,
          lineHeight: 30,
        },
      },
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove",
      },
      series: [
        {
          type: "sankey",
          data: data.nodes,
          links: data.links,
          emphasis: {
            focus: "adjacency",
          },
          label: {
            color: '#fff',
          },
          // levels: [
          //   {
          //     depth: 0,
          //     itemStyle: {
          //       color: "#fbb4ae",
          //     },
          //     lineStyle: {
          //       color: "source",
          //       opacity: 0.6,
          //     },
          //   },
          //   {
          //     depth: 1,
          //     itemStyle: {
          //       color: "#b3cde3",
          //     },
          //     lineStyle: {
          //       color: "source",
          //       opacity: 0.6,
          //     },
          //   },
          //   {
          //     depth: 2,
          //     itemStyle: {
          //       color: "#ccebc5",
          //     },
          //     lineStyle: {
          //       color: "source",
          //       opacity: 0.6,
          //     },
          //   },
          //   {
          //     depth: 3,
          //     itemStyle: {
          //       color: "#decbe4",
          //     },
          //     lineStyle: {
          //       color: "source",
          //       opacity: 0.6,
          //     },
          //   },
          // ],
          lineStyle: {
            curveness: 0.5,
          },
        },
      ],
    })
  );
}
export default {
  name: "YuanMuECharts",
  props: {
    chartData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      key: "",
    };
  },
  methods: {
    name() { },
  },
  mounted() {
    //数据target==source会报错
    this.chartData.links.forEach(element => {
      if(element.target==element.source){
        element.target=""
      }
    });
    initEcharts(this.chartData);
  },

};
</script>

<style lang="scss" scoped>
#yuanmuecharts {
  position: relative;
}
#main {
  width: 100%;
  height: 400px;
}
</style>
