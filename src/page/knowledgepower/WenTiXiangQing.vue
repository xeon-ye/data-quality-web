<!--
 * @Author: your name
 * @Date: 2021-03-02 11:08:22
 * @LastEditTime: 2021-03-09 17:39:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\knowledgepower\WenTiXiangQing.vue
-->
<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>问题详情</span>
      </div>
      <div>
        <div v-if="knowledge">
          <span class="row-td">目标数据源：{{ knowledge.model }}</span>
          <span class="row-td">触发规则：{{ knowledge.rule }}</span>
          <span class="row-td">责任人：{{ knowledge.user }}</span>
          <span class="row-td">触发时间：{{ knowledge.time }}</span>
        </div>
        <div v-else>无数据</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {

  props: {
    knowledge: {
      type: Object,
      default: {}
    }
  },

  mounted() {

    console.log(this.knowledge)
  }
};
</script>

<style lang="scss" scoped>
.row-td {
  display: inline-block;
  font-size: 12px;
  line-height: 30px;
  margin-right: 20px;
}
</style>
