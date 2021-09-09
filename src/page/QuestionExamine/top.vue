<!--
 * @Author: your name
 * @Date: 2021-03-01 17:53:05
 * @LastEditTime: 2021-03-11 17:20:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionExamine\top.vue
-->
<template>
  <div class="qe-top">
    <!-- <el-select class="select-w " v-model="value" placeholder="请选择" size="mini">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select> -->

    <el-input clearable class="select-w" v-model="$store.state.wentifankui.FANKUISHENHEVAL" placeholder="请输入内容" size="mini"></el-input>
    <el-button type="primary" icon="el-icon-search" size="mini" @click="chaXunShenHeTable">查询</el-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      input: '',
      options: [
        { label: '全部', value: 1 },
        { label: '告警', value: 2 },
        { label: '阻塞', value: 3 }
      ]
    };
  },
  mounted() {
    // this.getGuiZheList();
  },
  methods: {
    ...mapMutations([
      'SET_TYPELISTALL'
    ]),
    chaXunShenHeTable() {
      this.$emit('chaXunShenHeTable');
    },
    // getGuiZheList() {
    //   getGuiZheList(this);
    // },
  }
};

// 请求规则列表
// function getGuiZheList(vm) {
//   vm.$R
//     .queryDict({
//       type: ['issue_stage', 'process_method']
//     })
//     .then((res) => {
//       vm.SET_TYPELISTALL(res);
//     });
// }
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
