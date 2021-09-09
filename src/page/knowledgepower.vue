<!--
 * @Author: your name
 * @Date: 2021-01-20 14:18:06
 * @LastEditTime: 2021-03-09 13:36:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\KnowledgePower.vue
-->
<template>
  <div class="knowledge-power">
    <div class="left">
      <left-menu @searchKnowledgeTable="searchKnowledgeTable"></left-menu>
    </div>
    <div class="right">
      <div v-if="isTable">
        <!-- <k-top class="mar-b-10" @searchKnowledgeTable="searchKnowledgeTable"></k-top> -->
        <k-table ref="knowledgeTable" :isTable="isTable" @changeIsTable="changeIsTable"></k-table>
      </div>
      <div v-else>
        <div class="mar-b-10 btn-box">
          <el-button type="primary" icon="el-icon-back" size="mini" @click="changeIsTable(true)">返回</el-button>
        </div>
        <wen-ti-xiang-qing class="mar-b-10" :knowledge="knowledge"></wen-ti-xiang-qing>
        <chu-li-fan-kui class="mar-b-10" :knowledge="knowledge"></chu-li-fan-kui>
        <!-- <k-knowledge class="mar-b-10" :knowledge="knowledge"></k-knowledge> -->
      </div>
    </div>
  </div>
</template>

<script>
import leftMenu from "./knowledgepower/LeftMenu";
import kTop from "./knowledgepower/Top";
import WenTiXiangQing from "./knowledgepower/WenTiXiangQing";
import ChuLiFanKui from "./knowledgepower/ChuLiFanKui";
import kKnowledge from "./knowledgepower/Knowledge";
import kTable from "./knowledgepower/Table";

export default {
  components: {
    leftMenu,
    kTop,
    WenTiXiangQing,
    ChuLiFanKui,
    kTable,
    kKnowledge
  },
  data() {
    return {
      isTable: true,
      knowledge: {}
    };
  },

  methods: {
    // handleClose() {},
    searchKnowledgeTable(node) {
      this.isTable = true
      this.$nextTick(() => {
        this.$refs.knowledgeTable.getKnowledgeList(node?.rule);
      });
    },
    changeIsTable(isTable, data) {
      this.isTable = isTable;
      if (!isTable)
        this.knowledge = data
    }
  }
};
</script>

<style lang="scss" scoped>
.knowledge-power {
  width: 100%;
  display: flex;
  .left {
    width: 200px;
    height: calc(100vh - 120px);
    overflow-x: hidden;
    padding: 10px;
    background: #39436a;
  }
  .right {
    width: 600px;
    flex-grow: 1;
    background: #fff;
    padding: 10px;
  }
}

.btn-box {
  display: flex;
  justify-content: flex-end;
}
</style>
