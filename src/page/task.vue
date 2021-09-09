<!--
 * @Author: your name
 * @Date: 2021-03-08 13:23:00
 * @LastEditTime: 2021-03-09 18:25:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\jigouweihui\index.vue
-->
<template>
  <div class="page">
    <el-tabs v-model="jobType">
      <el-tab-pane label="日报任务" name="day"></el-tab-pane>
      <el-tab-pane label="月报任务" name="month"></el-tab-pane>
      <el-tab-pane label="自定义任务" name="diy"></el-tab-pane>
      <div class="header">
        <div class="left">
          <el-select v-model="search.dept" size="mini" class="mar-r-10" @change="deptChange">
            <el-option
              v-for="(item, index) in deptList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select v-model="search.model" size="mini" class="mar-r-10" @change="querySearch">
            <el-option
              v-for="(item, index) in modelList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select v-model="search.status" size="mini" class="mar-r-10" @change="querySearch">
            <el-option
              v-for="(item, index) in statusList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-date-picker
            v-if="jobType == 'month'"
            v-model="daterange"
            type="monthrange"
            range-separator="至"
            size="mini"
            class="mar-r-10"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            value-format="yyyy-MM"
            @change="querySearch"
          >
          </el-date-picker>
          <el-date-picker
            v-else
            v-model="daterange"
            type="daterange"
            range-separator="至"
            size="mini"
            class="mar-r-10"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="querySearch"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="querySearch">
            查询
          </el-button>
        </div>
        <div class="right">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="showZiDingYiQuJianJianCheDialog"
            >{{jobType=='day'?'新增日报任务':jobType=='month'?'新增月报任务':'新增自定义任务'}}</el-button
          >
        </div>
      </div>

      <div class="qa-body">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-table
              ref="taskTable"
              stripe
              size="mini"
              :data="tableData"
              border
              style="width: 100%"
              @row-click="rowClick"
              highlight-current-row
            >
              <el-table-column prop="id" label="批次号" width="60"> </el-table-column>
              <el-table-column prop="model" label="数据源"> </el-table-column>
              <el-table-column prop="dateRange" label="核查区间"> </el-table-column>
              <el-table-column prop="executeTime" label="执行时间" width="150"> </el-table-column>
              <el-table-column prop="status" label="状态"></el-table-column>
            </el-table>

            <div class="mar-t-10">
              <el-pagination
                @current-change="changeFenYe"
                class="qa-pagination"
                background
                layout="prev, pager, next"
                :current-page.sync="current"
                :total="total"
              >
              </el-pagination>
            </div>
          </el-col>
          <el-col :span="14">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>任务详情</span>
              </div>
              <div class="box-card">
                <div v-if="jobData&&jobData.length">
                  <div v-for="item in jobData" :key="item.id" class="item-box">
                    <el-row class="detail">
                      <el-col :span="5">目标表：{{ item.tableName }}</el-col>
                      <el-col :span="5">触发规则：{{ item.ruleName }}</el-col>
                      <el-col :span="5">JOB：{{ item.categoryName }}</el-col>
                      <el-col :span="5">责任人：{{ item.userName }}</el-col>
                      <el-col :span="4">触发时间：{{ item.time }}</el-col>
                    </el-row>
                    <p>问题：</p>
                    <p class="desc">{{ item.errorComment }}</p>
                  </div>
                </div>
                <div v-else>暂无数据</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-tabs>

    <el-dialog
      class="k-dialog "
      title="自定义区间检测"
      :visible.sync="ziDingYiQuJianJianCheDialog"
      width="70%"
      :close-on-click-modal="false"
    >
      <qujianjiance
        ref="qujianjiance"
        @zhi-xing="zhiXing"
        :jobType="jobType"
        :deptList="deptList"
        :modelList="modelList"
        :ruleList="ruleList"
        v-if="ziDingYiQuJianJianCheDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import qujianjiance from './components/dialogZiDingYiQuJianJianChe';
export default {
  components: {
    qujianjiance
  },
  data() {
    return {
      jobType: 'day',
      search: {
        dept: '',
        model: '',
        status: '',
        startTime: '',
        endTime: ''
      },
      deptList: [],
      modelList: [],
      statusList: [],
      ruleList: [],
      daterange: [],
      tableData: [],
      total: 0,
      current: 1,
      jobData: [],
      ziDingYiQuJianJianCheDialog: false
    };
  },
  async mounted() {
    await this.queryDict();
    await this.queryModel();
    await this.getTableData(1);
  },
  methods: {
    async queryDict() {
      let that = this;
      await this.$R
        .queryDict({
          types: 'dept,jobstatus,rule'
        })
        .then((res) => {
          that.deptList = res.dept;
          that.ruleList = res.rule;
          this.statusList = res.jobstatus;
          if (res.dept && res.dept.length) that.search.dept = res.dept[0].code;
          if (res.jobstatus && res.jobstatus.length) that.search.status = res.jobstatus[0].code;
        });
    },
    async queryModel(){
      let that = this;
      await this.$R
          .getDict({
            type: 'model',
            option: that.search.dept
          })
          .then((res) => {
            if (res && res.length){
              that.modelList = res;
              that.search.model = res[0].code;
            }else{
              that.modelList = [];
              that.search.model = '';
            }
          });
    },
    rowClick(row) {
      this.getJobInfo(row);
    },
    changeFenYe(current) {
      this.getTableData(current);
    },
    querySearch() {
      this.getTableData(1);
    },
    async getTableData(page) {
      let that = this;
      let startTime = '';
      let endTime = '';
      if (this.daterange && this.daterange.length) {
        startTime = this.daterange[0];
        endTime = this.daterange[1];
        if (this.jobType === 'month') {
          startTime += '-01';
          endTime += '-01';
        }
      }
      let data = {
        current: page,
        size: 10,
        dept: this.search.dept,
        model: this.search.model,
        jobType: this.jobType,
        status: this.search.status,
        startTime: startTime,
        endTime: endTime
      };
      try {
        await this.$R.getJobList(data).then((res) => {
          this.total = res.total;
          that.tableData = res.records;

          // 初始化第一行数据
          if (res.records && res.records.length) {
            this.$refs.taskTable.setCurrentRow(res.records[0]);
            this.getJobInfo(res.records[0]);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    getJobInfo(row) {
      let data = {
        id: row.id
      };
      this.$R.getJobInfo(data).then((res) => {
        this.jobData = res;
      });
    },
    showZiDingYiQuJianJianCheDialog() {
      let rules = [];
      if (this.jobType === 'day' || this.jobType === 'month')
        rules = this.ruleList.map((item) => item.code);
      this.ziDingYiQuJianJianCheDialog = true;
      this.$nextTick(() => {
        this.$refs.qujianjiance.setRule(rules);
      });
    },
    zhiXing(load) {
      if (load) this.getTableData(1);
      this.ziDingYiQuJianJianCheDialog = false;
    },
    deptChange(){
      this.queryModel();
      this.getTableData(1);
    }
  },
  watch: {
    jobType() {
      if (this.jobType) {
        this.daterange = [];
        this.querySearch();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  background: #fff;
  height: 100%;
  padding: 0 10px;

  /deep/ .el-tabs__header {
    margin: 0;
  }

  /deep/.el-table__body tr.current-row > td {
    background-color: #a3caf8 !important;
  }

  .header {
    display: flex;
    height: 50px;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .x-input {
        width: 200px;
      }
    }
  }

  .item-box {
    border-bottom: 1px dashed #ccc;
    padding: 10px 0;
  }
  .desc {
    text-indent: 2em;
  }

  /deep/.box-card .el-card__body {
    max-height: 394px;
    overflow-y: auto;
  }
}
</style>
