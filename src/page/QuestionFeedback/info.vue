<!--
 * @Author: your name
 * @Date: 2021-03-01 15:53:42
 * @LastEditTime: 2021-03-11 09:46:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionFeedback\info.vue
-->
<template>
  <div>
    <el-card class="box-card" shadow="never ">
      <div slot="header" class="clearfix">
        <span>问题详情</span>
      </div>
      <div>
        <div v-if="ROWDATA">
          <el-row class="detail">
            <el-col :span="8" :title="ROWDATA.table">表名：{{ ROWDATA.table }}</el-col>
            <el-col :span="8">触发规则：{{ ROWDATA.rule }}</el-col>
            <el-col :span="8">机构：{{ ROWDATA.hospital }}</el-col>
            <el-col :span="8">数据源：{{ ROWDATA.model }}</el-col>
            <el-col :span="8">时间区间：{{ ROWDATA.businessTime }}</el-col>
            <el-col :span="8">触发时间：{{ ROWDATA.time }}</el-col>
            <el-col :span="24">责任人：{{ ROWDATA.user }}</el-col>
            <el-col :span="8">问题分析：</el-col>
          </el-row>
          <el-row v-if="ROWDATA&&ROWDATA.data&&ROWDATA.data.length&&ROWDATA.data[0]">
            <el-table size="mini" :data="ROWDATA.data" border stripe v-if="ROWDATA.ruleCode =='source_target'">
              <el-table-column type="index" label="序"> </el-table-column>
              <el-table-column prop="tableName" label="表名称"> </el-table-column>
              <el-table-column prop="tableNameCN" label="表中文名"> </el-table-column>
              <el-table-column prop="score" label="分数"> </el-table-column>
            </el-table>
            <el-table size="mini" :data="ROWDATA.data" border stripe v-if="ROWDATA.ruleCode == 'main_detail'">
              <el-table-column type="index" label="序"> </el-table-column>
              <el-table-column prop="tableName" label="表名称"> </el-table-column>
              <el-table-column prop="tableNameCN" label="表中文名"> </el-table-column>
              <el-table-column prop="score" label="分数"> </el-table-column>
            </el-table>
            <el-table size="mini" :data="ROWDATA.data" border stripe :span-method="objectSpanMethod" v-else>
              <el-table-column type="index" label="序"> </el-table-column>
              <el-table-column prop="field" label="字段名称"> </el-table-column>
              <el-table-column prop="fieldComment" label="字段中文名"> </el-table-column>
              <!-- <el-table-column prop="comment" label="备注"> </el-table-column> -->
              <el-table-column prop="score" label="分数"> </el-table-column>
              <el-table-column label="填充率" v-if="ROWDATA.ruleCode=='non_empty'">
                <template slot-scope="scope">
                  <el-link type="danger" :underline="false">{{scope.row.fillRate}}</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div v-else>无数据</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      tableData: []
    };
  },
  computed: {
    ...mapState({
      ROWDATA: (state) => state.wentifankui.ROWDATA
    }),
    rowspans: function () {
      let rowspans = [0]
      if (this.ROWDATA && this.ROWDATA.data && this.ROWDATA.data.length && this.ROWDATA.data[0]) {
        let lastRate = this.ROWDATA.data[0].fillRate
        this.ROWDATA.data.forEach((element, index) => {
          if (element.fillRate !== lastRate) {
            rowspans.push(index)
            lastRate = element.fillRate
          }
        });
      }
      return rowspans;
    },
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        if (this.rowspans.includes(rowIndex)) {
          let index = this.rowspans.indexOf(rowIndex)
          let nextRowspan = this.rowspans.length - 1 > index ? this.rowspans[index + 1] : this.ROWDATA.data.length
          return {
            rowspan: nextRowspan - rowIndex,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.detail {
  .el-col {
    height: 20px;
    line-height: 20px;
    // word-wrap: break-word;
    // word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
/deep/.box-card .el-card__body {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 10px;
}
</style>
