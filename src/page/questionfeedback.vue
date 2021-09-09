<!--
 * @Author: your name
 * @Date: 2021-01-20 14:18:06
 * @LastEditTime: 2021-03-10 15:31:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionFeedback.vue
-->
<template>
  <div class="xh-question">
    <div class="qa-header">
      <qa-header @chaXun="chaXun"></qa-header>
    </div>

    <div class="qa-body">
      <el-row :gutter="20">
        <el-col :span="10">
          <qa-table ref="qftable"></qa-table>
        </el-col>
        <el-col :span="14">
          <qa-info class="qa-info"></qa-info>
          <qa-fankuan @chaXun="chaXun"></qa-fankuan>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import qaHeader from './QuestionFeedback/header';
import qaTable from './QuestionFeedback/table';
import qaInfo from './QuestionFeedback/info';
import qaFankuan from './QuestionFeedback/fanKuan';
export default {
  components: {
    qaHeader,
    qaTable,
    qaInfo,
    qaFankuan
  },

  data() {
    return {};
  },
  methods: {
    chaXun() {
      this.$refs.qftable.getIssueQuery(1);
    }
  }
};
</script>

<style lang="scss" scoped>
.xh-question {
  background: #f6f7fa;
  .qa-header {
    background: #fff;
    padding: 10px;
    // height: 60px;
    display: flex;
    align-items: center;
  }
  .qa-body {
    background: #fff;
    padding: 0 10px;
  }
}

.xh-title {
  width: 100%;
  line-height: 50px;
  font-size: 14px;
  color: #5e5e5e;
}
.qa-info {
  margin-bottom: 20px;
}
</style>
