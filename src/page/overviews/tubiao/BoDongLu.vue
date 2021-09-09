<!--
 * @Author: your name
 * @Date: 2021-01-21 10:00:35
 * @LastEditTime: 2021-03-08 17:10:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\overviews\tubiao\BoDongLu.vue
-->

<template>
  <!-- !!!!波动率目前对应的是行数检测 -->
  <div>
    <ve-line :data="chartData" :title="title" :legend="legend" :extend="extend"></ve-line>
  </div>
</template>

<script>
export default {
  data: function () {
    this.extend = {
      'xAxis.0.axisLabel.color': 'white',
      color: ['#38e5cf', '#e4b617', '#24b5f9'],
      xAxis: {
        axisLabel: {
          color: '#fff',
          rotate: 45
        }
      },
      yAxis: {
        axisLabel: {
          color: '#fff'
        }
      }
    };
    return {
      title: {
        text: '波动率检测',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal',
          fontSize: 14,
          lineHeight: 30
        }
      },





      legend: {
        right: 0,
        textStyle: {
          color: '#fff'
        }
      }
    };
  },

  props: {
    chartData: {
      type: Object,
      default: []
    }
  }
};
</script>

<style lang="scss" scoped></style>
