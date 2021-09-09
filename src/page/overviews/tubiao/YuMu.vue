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
import * as echarts from 'echarts';

function initEcharts(data) {
  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);

  var titleArr = [],
    seriesArr = [];

  data.forEach(function(item, index) {
    titleArr.push({
      text: item.name,
      left: getCenter(index, data),
      top: '70%',
      textAlign: 'center',
      textStyle: {
        fontWeight: 'normal',
        fontSize: '20',
        color: 'white',
        textAlign: 'center'
      }
    });
    seriesArr.push(
      {
        type: 'gauge',
        radius: '33%',
        clockwise: true,
        startAngle: '90',
        endAngle: '-269.9999',
        splitNumber: 15,
        detail: {
          // offsetCenter: [0, -100],
          formatter: ' '
        },
        zlevel: 3,
        center: [getCenter(index, data), '45%'],
        pointer: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          length: 10,
          lineStyle: {
            color: '#283259',
            width: 10
          }
        },
        axisLabel: {
          show: false
        }
      } //中间环形分割线
    );
  });

  let x = ['30%', '70%'];

  data.forEach((element, index) => {
    seriesArr.push({
      name: element.name,
      type: 'pie',
      clockWise: false,
      radius: ['28%', '33%'],
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#0ff'
            },
            {
              offset: 1,
              color: '#5467df'
            }
          ]),
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        }
      },
      hoverAnimation: false,
      center: [getCenter(index, data), '45%'],
      data: [
        {
          value: element.value,
          label: {
            normal: {
              formatter: function(params) {
                return params.value;
              },
              position: 'center',
              show: true,
              textStyle: {
                fontSize: '25',
                // fontWeight: 'bold',
                color: '#1cc7ff'
              }
            }
          }
        },
        {
          value: 100 - element.value,
          name: 'invisible',
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              color: 'rgba(0,0,0,0)'
            }
          }
        }
      ]
    });
  });

  titleArr.push({
    text: '源目检测',
    textStyle: {
      color: '#fff',
      fontWeight: 'normal',
      fontSize: 14,
      lineHeight: 30
    }
  });

  myChart.setOption({
    grid: {
      left: '5%',
      right: '2%',
      bottom: '0%',
      top: '0%',
      containLabel: true
    },
    // backgroundColor: '#313034',
    title: titleArr,
    series: seriesArr
  });
}
export default {
  name: 'YuanMuECharts',
  props: {
    chartData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      key: ''
    };
  },
  methods: {
    name() {},
    updateEcharts(chartData){
      initEcharts(chartData);
    }
  },
  mounted() {
    //数据target==source会报错
    // this.chartData.links.forEach((element) => {
    //   if (element.target == element.source) {
    //     element.target = '';
    //   }
    // });
    initEcharts(this.chartData);
    // initEcharts();
  }
};

function getCenter(index, data) {
  switch (data.length) {
    case 1:
      return '50%';
      break;
    case 2:
      return ['30%', '70%'][index];
      break;
    case 3:
      return ['25%', '50%', '75%'][index];
      break;
    default:
      return '50%';
      break;
  }
}

function dotArr() {
  let dataArr = [];
  for (var i = 0; i < 80; i++) {
    if (i % 2 === 0) {
      dataArr.push({
        name: (i + 1).toString(),
        value: 1,
        itemStyle: {
          normal: {
            color: '#676a6c',
            borderWidth: 1,
            borderColor: '#676a6c'
          }
        }
      });
    } else {
      dataArr.push({
        name: (i + 1).toString(),
        value: 2,
        itemStyle: {
          normal: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)'
          }
        }
      });
    }
  }
  return dataArr;
}
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
