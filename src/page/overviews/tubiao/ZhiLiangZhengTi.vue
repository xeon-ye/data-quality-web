<!--
 * @Author: your name
 * @Date: 2021-01-21 10:00:55
 * @LastEditTime: 2021-02-22 14:37:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\overviews\tubiao\zhiLiangAll.vue
-->
<template>
  <div>
    <ve-radar :data="chartData" :title="title" :radar='radar' :settings="chartSettings" :legend="legend" :extend="extend"></ve-radar>
  </div>
</template>

<script>
export default {
  props: {
    chartData: {
      type: Object,
      default: null,
    },
  },
  data() {

    this.chartSettings = {
      dimension: ['model'],
      metrics: ['absScore', 'enumScore', 'mainDetailScore', 'nonEmptyScore', 'rowScore', 'sourceTargetScore'],
      labelMap: {
        'absScore': '绝对值',
        'enumScore': '枚举值检查',
        'mainDetailScore': '主子检查',
        'nonEmptyScore': '非空检查',
        'rowScore': '波动率检测',
        'sourceTargetScore': '源目检测',
      },
    },
      this.extend = {
        "series.0.symbol": "none",
        "series.0.data.0.areaStyle.color": '#41cdc7',
        "series.0.data.0.areaStyle.opacity": 0.8,
        "series.0.data.0.itemStyle.color": '#38e5cf',
        "series.0.data.0.lineStyle.color": '#38e5cf',
        "series.0.data.1.areaStyle.color": '#428aab',
        "series.0.data.1.itemStyle.color": '#e4b617',
        "series.0.data.1.lineStyle.color": '#e4b617',
        "series.0.data.2.areaStyle.color": '#428aab',
        "series.0.data.2.itemStyle.color": '#38e599',
        "series.0.data.2.lineStyle.color": '#38e599',
      };
    return {

      dataEmpty: true,
      title: {
        text: "质量整体情况",
        textStyle: {
          color: "#fff",
          fontWeight: "normal",
          fontSize: 14,
          lineHeight: 30,
        },
      },
      radar: {
        indicator: [
          { text: '绝对值', max: 100 },
          { text: '枚举值检查', max: 100 },
          { text: '主子检查', max: 100 },
          { text: '非空检查', max: 100 },
          { text: '波动率检测', max: 100 },
          { text: '源目检测', max: 100 }
        ],
        shape: 'circle',
        splitNumber: 4,
        splitArea: {
          areaStyle: {
            color: ['#146184', '#207296', '#2d7da1', '#338db5', 'black'],
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 10
          }
        },
        axisLine: {
          lineStyle: {
            color: '#93dafb'
          }
        },
        splitLine: {
          lineStyle: {
            color: ['#4cbff8', '#6acaf9', '#8ad4f9', '#a2ddfa', '#338db5']
          }
        },
      },
      legend: {
        right: 0,
        textStyle: {
          color: "#fff",
        }
      },
    };
  }
};
</script>

<style lang="scss" scoped></style>
