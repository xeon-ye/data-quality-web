<!--
 * @Author: your name
 * @Date: 2021-03-01 17:53:05
 * @LastEditTime: 2021-03-02 11:26:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionExamine\top.vue
-->
<template>
  <div class="qe-top">
    <el-select class="select-w " v-model="search.type" placeholder="请选择" size="mini">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>

    <el-input class="select-w " v-model="search.value" placeholder="请输入内容" size="mini"></el-input>
    <el-button type="primary" icon="el-icon-search" size="mini" @click="searchKnowledgeTable">查询</el-button>

  </div>
</template>

<script>
export default {
  data() {
    return {
      search: {
        type: "",
        value: ""
      },
      options: [
        { label: "全部", value: 1 },
        { label: "告警", value: 2 },
        { label: "阻塞", value: 3 },
      ],
    };
  },

  methods: {
    searchKnowledgeTable() {
      this.$emit('searchKnowledgeTable', null, this.search);
    }
  }
};
</script>

<style lang="scss" scoped>
.qe-top {
  display: flex;
  .select-w {
    width: 150px;
    margin-right: 20px;
  }
}
</style>
