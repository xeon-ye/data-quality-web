<!--
 * @Author: your name
 * @Date: 2021-03-01 15:53:34
 * @LastEditTime: 2021-03-12 15:00:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionFeedback\table.vue
-->
<template>
  <div>
    <el-table ref="issueTable" size="mini" :data="tableData" border stripe style="width: 100%" @row-click="rowClick" highlight-current-row>
      <el-table-column prop="id" label="问题编号" width="80"> </el-table-column>
      <el-table-column prop="hospital" width="120" label="机构" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="table" label="表名" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="rule" label="规则" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="time" label="时间" width="150"> </el-table-column>
      <el-table-column label="分数" width="100">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false">{{scope.row.score}}</el-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="fenye">
      <el-pagination @current-change="changeFenYe"
                     class="qa-pagination"
                     background layout="prev, pager, next"
                     :current-page.sync="current"
                     :page-size.sync="size"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import bus from '@/components/common/bus';

export default {
  data() {
    return {
      total: 0,
      current: 1,
      size: 15,
      tableData: []
    };
  },
  computed: {
    ...mapState({
      soushuoall: (state) => state.wentifankui.SOUSHUOALL
    })
  },
  mounted() {
    // this.getIssueQuery(1);
  },
  methods: {
    ...mapMutations({
      SET_ROWDATA: 'SET_ROWDATA'
    }),
    rowClick(row) {
      this.getIssueInfo(row);
    },
    changeFenYe(current) {
      this.getIssueQuery(current);
    },
    //问题列表
    getIssueQuery(current) {
      this.current = current
      var param = {
        id: this.soushuoall.id || '',
        hospital: this.soushuoall.hospital || '',
        model: this.soushuoall.model || '',
        table: this.soushuoall.table || '',
        rule: this.soushuoall.rule || '',
        dateType: this.soushuoall.dateType || '',
        timeType: this.soushuoall.businessTime ? (this.soushuoall.timeType || 'day') : "",
        businessTime: this.soushuoall.businessTime || '',
        user: this.soushuoall.user || '',
        current: current,
        size: this.size
      };
      this.$R.getIssueQuery(param).then((res) => {
        this.total = res.total;
        this.tableData = res.records;

        // 初始化第一行数据
        if (res.records && res.records.length) {
          this.$refs.issueTable.setCurrentRow(res.records[0]);
          this.getIssueInfo(res.records[0])
        }
      });
    },
    //获取问题详情
    getIssueInfo(row) {
      let data = {
        id: row.id,
        rule: row.ruleCode || this.soushuoall.rule
      }
      this.$R.getIssueResult(data).then((res) => {
        row.data = res.records
        this.SET_ROWDATA(row);
        bus.$emit('fankui', row);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.fenye {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  .qa-pagination {
    padding: 10px 0;
    margin-right: -5px;
  }
}

/deep/.el-table__body tr.current-row > td {
  background-color: #a3caf8 !important;
}
</style>
