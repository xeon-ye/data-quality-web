<!--
 * @Author: your name
 * @Date: 2021-01-21 10:01:11
 * @LastEditTime: 2021-03-18 11:05:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\overviews\tubiao\juDuiZhi.vue
-->
<template>
  <div id="echartsJueDuiZhi" class="r-box k-drak">
    <el-select class="select" v-model="typeValue" @change="changeModel" placeholder="请选择" size="mini">
      <el-option v-for="item in typeList" :key="item.model" :label="item.model" :value="item.model">
      </el-option>
    </el-select>

    <ve-wordcloud :data="wordcloud" :settings="chartSettings" :title="title"></ve-wordcloud>
  </div>
</template>

<script>
export default {
  name: 'echartsJueDuiZhi',
  data() {
    this.chartSettings = {
      color: ['#f7f93a','#37f3f2','#36e373','#f7f93a','#67ef85','#31b5f3','#f08647','#ff5078','#f08647','#21aced','#ff9f55','#f47ed1','#ababf5','#f7f93a','#30a7e3','#ead256','#f26565','#f7f93a','#3af9a1','#f7f93a'],
    };
    return {
      // 图表数据
      title: {
        text: '绝对值检测',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal',
          fontSize: 14,
          lineHeight: 30
        }
      },

      wordcloud: null,

      // 组件数据
      typeList: this.chartData,
      typeValue: this.chartData[0].model
    };
  },

  props: {
    chartData: {
      type: Array,
      default: null
    }
  },

  mounted() {
    this.wordcloud = zhuangHuanChartData(this);
  },

  methods: {
    changeModel() {
      this.wordcloud = zhuangHuanChartData(this);
    }
  }
};

// 转换图表数据格式
function zhuangHuanChartData(vm) {
  var data = vm.chartData.find(item => item.model == vm.typeValue)
  var newObj = {};
  newObj.columns = ['fieldComment', 'score'];
  newObj.rows = data.results;
  return newObj;
}
</script>

<style lang="scss" scoped>
#echartsJueDuiZhi {
  position: relative;
}
.select {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 90px;
  z-index: 9999;
}
</style>
