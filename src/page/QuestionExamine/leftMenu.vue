<!--
 * @Author: your name
 * @Date: 2021-03-01 17:52:38
 * @LastEditTime: 2021-03-11 16:50:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionExamine\leftMenu.vue
-->
<template>
  <div class="xh-from-drak xh-tree-drak">
    <div class="mar-b-10">
      <el-input v-model="filterText" placeholder="请输入关键字查询" size="mini">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="xh-tree knowledge-tree">
      <el-tree default-expand-all ref="ruletree" :data="data" :props="defaultProps" :filter-node-method="filterNode" @node-click="handleNodeClick"></el-tree>
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
    handleNodeClick(data) {
      console.log(data)
      this.$store.state.wentifankui.RULECODE = data.rule
      this.$emit('chaXunShenHeTable');
    },

    postruleTree() {
      postruleTree(this);
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },

  mounted() {
    this.postruleTree();
  },

  watch: {
    filterText(val) {
      this.$refs.ruletree.filter(val);
    }
  },
};

// 请求树的数据
function postruleTree(vm) {
  vm.$R.getIssueMenu().then((res) => {
    vm.data = res;
  });
}
</script>

<style lang="scss" scoped></style>
