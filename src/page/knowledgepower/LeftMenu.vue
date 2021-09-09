<!--
 * @Author: your name
 * @Date: 2021-03-01 17:52:38
 * @LastEditTime: 2021-03-09 17:38:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionExamine\leftMenu.vue
-->
<template>
  <div class="xh-from-drak xh-tree-drak">
    <div class="mar-b-10">
      <el-input clearable v-model="filterText" placeholder="请输入关键字查询">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="xh-tree knowledge-tree">
      <el-tree default-expand-all ref="knowledgetree" :data="data" :props="defaultProps" highlight-current :filter-node-method="filterNode" @node-click="handleNodeClick">
      </el-tree>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },

  methods: {
    handleNodeClick(data, node, self) {
      this.$emit('searchKnowledgeTable', data);
    },

    getKnowledgeTree() {
      getKnowledgeTree(this);
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }

  },

  mounted() {
    this.getKnowledgeTree();
  },

  watch: {
    filterText(val) {
      this.$refs.knowledgetree.filter(val);
    }
  },
};

// 请求树的数据
function getKnowledgeTree(vm) {
  vm.$R.getIssueMenu().then((res) => {
    vm.data = res;
  });
}
</script>