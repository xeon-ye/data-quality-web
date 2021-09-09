<!--
 * @Author: your name
 * @Date: 2021-01-20 14:18:06
 * @LastEditTime: 2021-03-11 17:51:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionExamine.vue
-->
<template>
  <div class="questionexamine">
    <div class="left">
      <left-menu @chaXunShenHeTable="chaXunShenHeTable"></left-menu>
    </div>
    <div class="right">
      <qe-top class="qe-top" @chaXunShenHeTable="chaXunShenHeTable"></qe-top>
      <qe-table ref="shenHeTable"></qe-table>
    </div>
    <el-dialog title="操作记录" :visible.sync="SHOWJILU" width="70%" :before-close="handleClose">
      <ji-lu></ji-lu>
    </el-dialog>
    <el-dialog title="知识总结" :visible.sync="SHOWKNOWLEDGE" width="40%" :before-close="handleKnowledgeClose">
      <knowledge></knowledge>
    </el-dialog>
  </div>
</template>

<script>
import leftMenu from './QuestionExamine/leftMenu';
import qeTable from './QuestionExamine/table';
import qeTop from './QuestionExamine/top';
import JiLu from './QuestionExamine/JiLu';
import knowledge from './QuestionExamine/Knowledge';
export default {
  components: {
    leftMenu,
    qeTable,
    JiLu,
    qeTop,
    knowledge
  },

  data() {
    return {
    };
  },

  computed: {
    SHOWJILU: {
      get() {
        return this.$store.state.fankuishenghe.SHOWJILU;
      },
      set(val) {
        this.$store.commit('SET_SHOWJILU', val);
      }
    },
    SHOWKNOWLEDGE: {
      get() {
        return this.$store.state.fankuishenghe.SHOWKNOWLEDGE;
      },
      set(val) {
        this.$store.commit('SET_SHOWKNOWLEDGE', val);
      }
    }
  },

  methods: {
    handleClose() {
      this.$store.commit('SET_SHOWJILU', false);
    },
    handleKnowledgeClose() {
      this.$store.commit('SET_SHOWKNOWLEDGE', false);
    },
    chaXunShenHeTable() {
      this.$refs.shenHeTable.postpageCheckIssue({
        keyword: this.$store.state.wentifankui.FANKUISHENHEVAL,
        rule: this.$store.state.wentifankui.RULECODE,
        current:0,
        size: 10
      });
    },
    searchKnowledgeTable(node) {
      this.isTable = true
      this.$refs.knowledgeTable.postKnowledgeList(node && node.code);
    },
  }
};
</script>

<style lang="scss" scoped>
.questionexamine {
  width: 100%;
  display: flex;
  .left {
    width: 200px;
    padding: 10px;
    height: calc(100vh - 120px);
    background: #39436a;
  }
  .right {
    width: 600px;
    flex-grow: 1;
    background: #fff;
    padding: 10px;
  }
  .qe-top {
    margin-bottom: 10px;
  }
}
</style>
