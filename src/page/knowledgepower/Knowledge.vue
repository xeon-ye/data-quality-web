<!--
 * @Author: your name
 * @Date: 2021-03-01 16:42:22
 * @LastEditTime: 2021-03-09 17:44:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionFeedback\fanKuan.vue
-->
<template>
  <div>
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>知识总结</span>
        </div>
        <div class="qa-body">

          <div class="box mb18">
            <div class="box-body">
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="knowledge.knowledgeDesc">
              </el-input>
            </div>
          </div>

        </div>
      </el-card>

    </el-form>
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

  data() {
    return {
    };
  },

  methods: {
  },

  mounted() {
  }
};
</script>

<style lang="scss" scoped></style>
